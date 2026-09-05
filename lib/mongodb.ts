import { MongoClient, Db, Collection } from 'mongodb';
import { CouncilAnalysisDocument } from '../types/ai';

// In-memory fallback storage in case MongoDB Atlas is unavailable or unconfigured
const inMemoryAnalyses: CouncilAnalysisDocument[] = [];

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;
let indexesCreated = false;
let lastConnectionAttempt = 0;
let connectionFailed = false;

export async function connectToDatabase(): Promise<{ client: MongoClient | null; db: Db | null }> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    return { client: null, db: null };
  }

  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // If connection failed recently, wait 30 seconds before retrying to prevent blocking
  const now = Date.now();
  if (connectionFailed && now - lastConnectionAttempt < 30000) {
    return { client: null, db: null };
  }

  lastConnectionAttempt = now;

  try {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
    });

    await client.connect();
    // Default to 'ai_council' if database name is not in URI
    const db = client.db('ai_council');

    cachedClient = client;
    cachedDb = db;
    connectionFailed = false;

    // Create indexes once
    if (!indexesCreated) {
      try {
        const collection = db.collection('analyses');
        await collection.createIndex({ createdAt: -1 });
        await collection.createIndex({ mode: 1 });
        await collection.createIndex({ selectedModels: 1 });
        indexesCreated = true;
      } catch {
        // Continue even if index creation fails (e.g. read-only permissions)
      }
    }

    return { client: cachedClient, db: cachedDb };
  } catch (err: unknown) {
    connectionFailed = true;
    console.warn('[MongoDB] Connection attempt failed, falling back to safe local storage:', (err as Error)?.message);
    return { client: null, db: null };
  }
}

export async function getAnalysesCollection(): Promise<Collection<CouncilAnalysisDocument> | null> {
  const { db } = await connectToDatabase();
  if (!db) return null;
  return db.collection<CouncilAnalysisDocument>('analyses');
}

export async function saveAnalysis(doc: CouncilAnalysisDocument): Promise<{ id: string; savedToDb: boolean }> {
  const collection = await getAnalysesCollection();

  if (collection) {
    try {
      const result = await collection.insertOne(doc as any);
      const id = result.insertedId.toString();
      return { id, savedToDb: true };
    } catch (err) {
      console.warn('[MongoDB] Save failed, saving to local fallback storage:', (err as Error)?.message);
    }
  }

  // Fallback storage
  const id = doc.id || `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const savedDoc = { ...doc, id, _id: id };
  inMemoryAnalyses.unshift(savedDoc);
  return { id, savedToDb: false };
}

export async function getAnalysesList(limit = 50): Promise<CouncilAnalysisDocument[]> {
  const collection = await getAnalysesCollection();

  if (collection) {
    try {
      const docs = await collection
        .find({})
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();

      return docs.map((d) => ({
        ...d,
        id: d._id?.toString() || (d as any).id,
      })) as CouncilAnalysisDocument[];
    } catch (err) {
      console.warn('[MongoDB] Query failed, retrieving from fallback storage:', (err as Error)?.message);
    }
  }

  return [...inMemoryAnalyses].slice(0, limit);
}

export async function getAnalysisById(id: string): Promise<CouncilAnalysisDocument | null> {
  const collection = await getAnalysesCollection();

  if (collection) {
    try {
      const { ObjectId } = await import('mongodb');
      let query: any = { id };
      if (ObjectId.isValid(id)) {
        query = { $or: [{ _id: new ObjectId(id) }, { id }] };
      }
      const doc = await collection.findOne(query);
      if (doc) {
        return {
          ...doc,
          id: doc._id?.toString() || (doc as any).id,
        } as CouncilAnalysisDocument;
      }
    } catch (err) {
      console.warn('[MongoDB] Find by ID failed:', (err as Error)?.message);
    }
  }

  const memoryDoc = inMemoryAnalyses.find((d) => d.id === id || d._id === id);
  return memoryDoc || null;
}

export async function deleteAnalysisById(id: string): Promise<boolean> {
  const collection = await getAnalysesCollection();
  let deletedFromDb = false;

  if (collection) {
    try {
      const { ObjectId } = await import('mongodb');
      let query: any = { id };
      if (ObjectId.isValid(id)) {
        query = { $or: [{ _id: new ObjectId(id) }, { id }] };
      }
      const res = await collection.deleteOne(query);
      deletedFromDb = res.deletedCount > 0;
    } catch (err) {
      console.warn('[MongoDB] Delete failed:', (err as Error)?.message);
    }
  }

  const initialLen = inMemoryAnalyses.length;
  const idx = inMemoryAnalyses.findIndex((d) => d.id === id || d._id === id);
  if (idx !== -1) {
    inMemoryAnalyses.splice(idx, 1);
  }

  return deletedFromDb || inMemoryAnalyses.length < initialLen;
}

export async function isMongoDbConnected(): Promise<boolean> {
  try {
    const { client } = await connectToDatabase();
    return !!client;
  } catch {
    return false;
  }
}

// Alias for backwards compatibility
export const getAnalyses = getAnalysesList;

