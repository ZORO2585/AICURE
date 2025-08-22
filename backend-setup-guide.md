# Backend Development Guide for AgriHealth AI Platform

## Table of Contents
1. [Technology Stack](#technology-stack)
2. [Project Structure](#project-structure)
3. [Database Design](#database-design)
4. [API Endpoints](#api-endpoints)
5. [AI Model Integration](#ai-model-integration)
6. [Authentication & Security](#authentication--security)
7. [File Upload & Storage](#file-upload--storage)
8. [Real-time Features](#real-time-features)
9. [Deployment](#deployment)
10. [Environment Setup](#environment-setup)

## Technology Stack

### Core Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL (primary) + Redis (caching/sessions)
- **ORM**: Prisma
- **Authentication**: JWT + Passport.js
- **File Storage**: AWS S3 or Cloudinary
- **AI/ML**: Python microservice with FastAPI + TensorFlow/PyTorch

### Additional Services
- **WebSocket**: Socket.io (real-time notifications)
- **Queue**: Bull Queue with Redis
- **Email**: SendGrid or Nodemailer
- **SMS**: Twilio
- **Weather API**: OpenWeatherMap
- **Maps**: Google Maps API

## Project Structure

```
backend/
├── src/
│   ├── controllers/          # Route handlers
│   ├── middleware/          # Custom middleware
│   ├── models/             # Database models (Prisma)
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── utils/              # Helper functions
│   ├── types/              # TypeScript types
│   ├── config/             # Configuration files
│   └── app.ts              # Express app setup
├── ai-service/             # Python AI microservice
│   ├── models/             # Trained ML models
│   ├── preprocessing/      # Image preprocessing
│   ├── inference/          # Model inference
│   └── main.py            # FastAPI app
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Database migrations
├── tests/                  # Test files
├── docker-compose.yml      # Development environment
├── Dockerfile             # Production container
└── package.json
```

## Database Design

### Core Tables

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    location JSONB, -- {lat, lng, address, country, region}
    language VARCHAR(10) DEFAULT 'en',
    farm_type VARCHAR(50), -- 'crop', 'livestock', 'mixed'
    farm_size DECIMAL(10,2),
    experience_years INTEGER,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Disease detections table
CREATE TABLE detections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    image_metadata JSONB, -- {width, height, size, format}
    disease_name VARCHAR(200),
    disease_type VARCHAR(50), -- 'crop', 'livestock'
    confidence_score DECIMAL(5,2),
    severity VARCHAR(20), -- 'low', 'medium', 'high'
    affected_area VARCHAR(200), -- body part or plant part
    symptoms JSONB, -- array of symptoms
    ai_model_version VARCHAR(50),
    location JSONB,
    weather_conditions JSONB,
    treatment_applied BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Diseases database
CREATE TABLE diseases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    scientific_name VARCHAR(200),
    type VARCHAR(50) NOT NULL, -- 'crop', 'livestock'
    category VARCHAR(100), -- 'fungal', 'bacterial', 'viral', 'parasitic'
    affected_species JSONB, -- array of affected crops/animals
    symptoms JSONB, -- array of symptoms with descriptions
    causes JSONB, -- environmental factors, pathogens
    prevention JSONB, -- prevention methods
    treatments JSONB, -- treatment options with details
    severity_levels JSONB, -- different severity descriptions
    seasonal_patterns JSONB, -- when disease is most common
    geographic_distribution JSONB, -- regions where disease occurs
    images JSONB, -- reference images
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Community posts
CREATE TABLE community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(300) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100), -- 'question', 'discussion', 'tip', 'alert'
    tags JSONB, -- array of tags
    images JSONB, -- array of image URLs
    location JSONB,
    likes_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT false,
    is_solved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Community replies
CREATE TABLE community_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    parent_reply_id UUID REFERENCES community_replies(id),
    content TEXT NOT NULL,
    images JSONB,
    likes_count INTEGER DEFAULT 0,
    is_solution BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Calendar activities
CREATE TABLE calendar_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(300) NOT NULL,
    description TEXT,
    activity_type VARCHAR(100), -- 'fertilization', 'irrigation', 'harvesting', 'vaccination'
    crop_type VARCHAR(100),
    location VARCHAR(200),
    scheduled_date TIMESTAMP NOT NULL,
    completed_date TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'overdue', 'cancelled'
    reminder_settings JSONB, -- notification preferences
    weather_dependent BOOLEAN DEFAULT false,
    recurring_pattern JSONB, -- for recurring activities
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Expert profiles
CREATE TABLE experts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    specialization JSONB, -- array of specializations
    credentials JSONB, -- education, certifications
    experience_years INTEGER,
    consultation_rate DECIMAL(10,2),
    availability JSONB, -- schedule and timezone
    rating DECIMAL(3,2) DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    languages JSONB, -- supported languages
    verified BOOLEAN DEFAULT false,
    bio TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL, -- 'disease_alert', 'weather_warning', 'reminder', 'community'
    title VARCHAR(300) NOT NULL,
    message TEXT NOT NULL,
    data JSONB, -- additional notification data
    read BOOLEAN DEFAULT false,
    priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints

### Authentication Endpoints

```typescript
// POST /api/auth/register
interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
    country: string;
    region: string;
  };
  farmType?: 'crop' | 'livestock' | 'mixed';
  farmSize?: number;
  experienceYears?: number;
}

// POST /api/auth/login
interface LoginRequest {
  email: string;
  password: string;
}

// POST /api/auth/refresh
// GET /api/auth/profile
// PUT /api/auth/profile
// POST /api/auth/forgot-password
// POST /api/auth/reset-password
```

### Disease Detection Endpoints

```typescript
// POST /api/detection/analyze
interface AnalyzeImageRequest {
  image: File; // multipart/form-data
  location?: {
    lat: number;
    lng: number;
  };
  cropType?: string;
  animalType?: string;
  symptoms?: string[];
  notes?: string;
}

interface AnalyzeImageResponse {
  detectionId: string;
  predictions: Array<{
    diseaseName: string;
    confidence: number;
    severity: 'low' | 'medium' | 'high';
    description: string;
    symptoms: string[];
    treatments: Array<{
      type: 'organic' | 'chemical' | 'biological';
      method: string;
      dosage?: string;
      frequency?: string;
      duration?: string;
      precautions: string[];
    }>;
    prevention: string[];
  }>;
  weatherContext?: {
    temperature: number;
    humidity: number;
    conditions: string;
  };
}

// GET /api/detection/history
// GET /api/detection/:id
// PUT /api/detection/:id/treatment
// DELETE /api/detection/:id
```

### Disease Database Endpoints

```typescript
// GET /api/diseases
interface DiseasesQuery {
  type?: 'crop' | 'livestock';
  category?: string;
  species?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// GET /api/diseases/:id
// GET /api/diseases/search
// GET /api/diseases/similar/:detectionId
```

### Community Endpoints

```typescript
// GET /api/community/posts
interface PostsQuery {
  category?: string;
  tags?: string[];
  location?: string;
  sortBy?: 'recent' | 'popular' | 'solved';
  page?: number;
  limit?: number;
}

// POST /api/community/posts
interface CreatePostRequest {
  title: string;
  content: string;
  category: string;
  tags: string[];
  images?: string[];
  location?: object;
}

// GET /api/community/posts/:id
// PUT /api/community/posts/:id
// DELETE /api/community/posts/:id
// POST /api/community/posts/:id/like
// POST /api/community/posts/:id/replies
// GET /api/community/posts/:id/replies
```

### Calendar Endpoints

```typescript
// GET /api/calendar/activities
interface ActivitiesQuery {
  startDate?: string;
  endDate?: string;
  status?: string;
  activityType?: string;
}

// POST /api/calendar/activities
interface CreateActivityRequest {
  title: string;
  description?: string;
  activityType: string;
  cropType?: string;
  location?: string;
  scheduledDate: string;
  reminderSettings?: object;
  weatherDependent?: boolean;
  recurringPattern?: object;
}

// PUT /api/calendar/activities/:id
// DELETE /api/calendar/activities/:id
// POST /api/calendar/activities/:id/complete
```

### Expert Network Endpoints

```typescript
// GET /api/experts
interface ExpertsQuery {
  specialization?: string;
  location?: string;
  available?: boolean;
  rating?: number;
  language?: string;
}

// GET /api/experts/:id
// POST /api/experts/:id/contact
// POST /api/experts/:id/review
```

## AI Model Integration

### Python AI Service (FastAPI)

```python
# ai-service/main.py
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import json
from typing import List, Dict, Any

app = FastAPI(title="AgriHealth AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained models
crop_model = tf.keras.models.load_model('models/crop_disease_model.h5')
livestock_model = tf.keras.models.load_model('models/livestock_disease_model.h5')

# Load disease metadata
with open('data/crop_diseases.json', 'r') as f:
    crop_diseases = json.load(f)

with open('data/livestock_diseases.json', 'r') as f:
    livestock_diseases = json.load(f)

@app.post("/analyze/crop")
async def analyze_crop_disease(
    file: UploadFile = File(...),
    crop_type: str = None
):
    try:
        # Read and preprocess image
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))
        image = preprocess_crop_image(image)
        
        # Make prediction
        predictions = crop_model.predict(image)
        
        # Process results
        results = process_crop_predictions(predictions, crop_type)
        
        return {
            "success": True,
            "predictions": results,
            "model_version": "crop_v2.1.0"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/livestock")
async def analyze_livestock_disease(
    file: UploadFile = File(...),
    animal_type: str = None,
    body_part: str = None
):
    try:
        # Read and preprocess image
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))
        image = preprocess_livestock_image(image)
        
        # Make prediction
        predictions = livestock_model.predict(image)
        
        # Process results
        results = process_livestock_predictions(predictions, animal_type, body_part)
        
        return {
            "success": True,
            "predictions": results,
            "model_version": "livestock_v1.8.0"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def preprocess_crop_image(image: Image.Image) -> np.ndarray:
    """Preprocess crop image for model input"""
    # Resize to model input size
    image = image.resize((224, 224))
    
    # Convert to RGB if needed
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    # Convert to numpy array and normalize
    image_array = np.array(image) / 255.0
    
    # Add batch dimension
    return np.expand_dims(image_array, axis=0)

def process_crop_predictions(predictions: np.ndarray, crop_type: str = None) -> List[Dict[str, Any]]:
    """Process crop disease predictions"""
    results = []
    
    # Get top 3 predictions
    top_indices = np.argsort(predictions[0])[-3:][::-1]
    
    for idx in top_indices:
        confidence = float(predictions[0][idx])
        
        if confidence > 0.1:  # Only include predictions above 10% confidence
            disease_info = crop_diseases[idx]
            
            # Filter by crop type if specified
            if crop_type and crop_type.lower() not in [c.lower() for c in disease_info.get('affected_crops', [])]:
                continue
            
            result = {
                "disease_name": disease_info['name'],
                "confidence": round(confidence * 100, 2),
                "severity": determine_severity(confidence, disease_info),
                "description": disease_info['description'],
                "symptoms": disease_info['symptoms'],
                "treatments": disease_info['treatments'],
                "prevention": disease_info['prevention'],
                "affected_crops": disease_info.get('affected_crops', []),
                "category": disease_info.get('category', 'unknown')
            }
            results.append(result)
    
    return results

def determine_severity(confidence: float, disease_info: Dict) -> str:
    """Determine disease severity based on confidence and disease characteristics"""
    base_severity = disease_info.get('base_severity', 'medium')
    
    if confidence > 0.8:
        if base_severity == 'high':
            return 'high'
        elif base_severity == 'medium':
            return 'high' if confidence > 0.9 else 'medium'
        else:
            return 'medium'
    elif confidence > 0.6:
        return base_severity
    else:
        return 'low' if base_severity != 'high' else 'medium'

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "AgriHealth AI"}
```

### Node.js Integration

```typescript
// src/services/aiService.ts
import axios from 'axios';
import FormData from 'form-data';
import { Readable } from 'stream';

interface AIAnalysisResult {
  success: boolean;
  predictions: Array<{
    disease_name: string;
    confidence: number;
    severity: string;
    description: string;
    symptoms: string[];
    treatments: any[];
    prevention: string[];
  }>;
  model_version: string;
}

class AIService {
  private aiServiceUrl: string;

  constructor() {
    this.aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8001';
  }

  async analyzeCropDisease(
    imageBuffer: Buffer,
    cropType?: string
  ): Promise<AIAnalysisResult> {
    try {
      const formData = new FormData();
      formData.append('file', Readable.from(imageBuffer), {
        filename: 'crop_image.jpg',
        contentType: 'image/jpeg'
      });
      
      if (cropType) {
        formData.append('crop_type', cropType);
      }

      const response = await axios.post(
        `${this.aiServiceUrl}/analyze/crop`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
          timeout: 30000, // 30 seconds timeout
        }
      );

      return response.data;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to analyze crop disease');
    }
  }

  async analyzeLivestockDisease(
    imageBuffer: Buffer,
    animalType?: string,
    bodyPart?: string
  ): Promise<AIAnalysisResult> {
    try {
      const formData = new FormData();
      formData.append('file', Readable.from(imageBuffer), {
        filename: 'livestock_image.jpg',
        contentType: 'image/jpeg'
      });
      
      if (animalType) {
        formData.append('animal_type', animalType);
      }
      
      if (bodyPart) {
        formData.append('body_part', bodyPart);
      }

      const response = await axios.post(
        `${this.aiServiceUrl}/analyze/livestock`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
          timeout: 30000,
        }
      );

      return response.data;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to analyze livestock disease');
    }
  }
}

export default new AIService();
```

## Authentication & Security

### JWT Implementation

```typescript
// src/middleware/auth.ts
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface JWTPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    
    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        verified: true,
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Rate limiting middleware
import rateLimit from 'express-rate-limit';

export const createRateLimit = (windowMs: number, max: number) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: 'Too many requests, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// API rate limits
export const generalRateLimit = createRateLimit(15 * 60 * 1000, 100); // 100 requests per 15 minutes
export const authRateLimit = createRateLimit(15 * 60 * 1000, 5); // 5 auth attempts per 15 minutes
export const uploadRateLimit = createRateLimit(60 * 1000, 10); // 10 uploads per minute
```

## File Upload & Storage

### Image Upload Service

```typescript
// src/services/uploadService.ts
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Multer configuration for memory storage
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

class UploadService {
  async uploadImage(
    buffer: Buffer,
    originalName: string,
    userId: string
  ): Promise<{ url: string; key: string; metadata: any }> {
    try {
      // Process image with Sharp
      const processedImage = await sharp(buffer)
        .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();

      // Get image metadata
      const metadata = await sharp(buffer).metadata();

      // Generate unique key
      const key = `images/${userId}/${uuidv4()}.jpg`;

      // Upload to S3
      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key,
        Body: processedImage,
        ContentType: 'image/jpeg',
        Metadata: {
          originalName,
          userId,
          uploadedAt: new Date().toISOString(),
        },
      });

      await s3Client.send(command);

      const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

      return {
        url,
        key,
        metadata: {
          width: metadata.width,
          height: metadata.height,
          format: metadata.format,
          size: processedImage.length,
        },
      };
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('Failed to upload image');
    }
  }

  async deleteImage(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key,
      });

      await s3Client.send(command);
    } catch (error) {
      console.error('Delete error:', error);
      throw new Error('Failed to delete image');
    }
  }
}

export default new UploadService();
```

## Real-time Features

### WebSocket Implementation

```typescript
// src/services/socketService.ts
import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';

class SocketService {
  private io: SocketIOServer;
  private userSockets: Map<string, string> = new Map();

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST'],
      },
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    this.io.use((socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        socket.userId = decoded.userId;
        next();
      } catch (error) {
        next(new Error('Authentication error'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`User ${socket.userId} connected`);
      
      // Store user socket mapping
      this.userSockets.set(socket.userId, socket.id);

      // Join user-specific room
      socket.join(`user:${socket.userId}`);

      socket.on('disconnect', () => {
        console.log(`User ${socket.userId} disconnected`);
        this.userSockets.delete(socket.userId);
      });

      // Handle real-time chat in community
      socket.on('join_post', (postId: string) => {
        socket.join(`post:${postId}`);
      });

      socket.on('leave_post', (postId: string) => {
        socket.leave(`post:${postId}`);
      });
    });
  }

  // Send notification to specific user
  sendNotificationToUser(userId: string, notification: any) {
    this.io.to(`user:${userId}`).emit('notification', notification);
  }

  // Send update to post subscribers
  sendPostUpdate(postId: string, update: any) {
    this.io.to(`post:${postId}`).emit('post_update', update);
  }

  // Broadcast disease alert to region
  broadcastDiseaseAlert(region: string, alert: any) {
    this.io.emit('disease_alert', { region, alert });
  }
}

export default SocketService;
```

## Environment Setup

### Environment Variables

```bash
# .env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/agrihealth"
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# AWS S3
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
S3_BUCKET_NAME="agrihealth-images"

# AI Service
AI_SERVICE_URL="http://localhost:8001"

# External APIs
OPENWEATHER_API_KEY="your-openweather-key"
GOOGLE_MAPS_API_KEY="your-google-maps-key"
TWILIO_ACCOUNT_SID="your-twilio-sid"
TWILIO_AUTH_TOKEN="your-twilio-token"
SENDGRID_API_KEY="your-sendgrid-key"

# App Configuration
NODE_ENV="development"
PORT="3001"
FRONTEND_URL="http://localhost:5173"

# Rate Limiting
REDIS_HOST="localhost"
REDIS_PORT="6379"
```

### Docker Setup

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: agrihealth
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  backend:
    build: .
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/agrihealth
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    volumes:
      - .:/app
      - /app/node_modules

  ai-service:
    build: ./ai-service
    ports:
      - "8001:8001"
    volumes:
      - ./ai-service:/app
      - ./ai-service/models:/app/models

volumes:
  postgres_data:
  redis_data:
```

## Deployment

### Production Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3001

CMD ["node", "dist/app.js"]
```

### Deployment Scripts

```bash
#!/bin/bash
# deploy.sh

# Build and push Docker images
docker build -t agrihealth-backend .
docker tag agrihealth-backend your-registry/agrihealth-backend:latest
docker push your-registry/agrihealth-backend:latest

# Deploy to production (example with Docker Swarm)
docker service update --image your-registry/agrihealth-backend:latest agrihealth-backend

# Run database migrations
docker exec -it agrihealth-backend npx prisma migrate deploy

echo "Deployment completed successfully!"
```

## Getting Started

1. **Clone and Setup**
   ```bash
   git clone <your-repo>
   cd backend
   npm install
   ```

2. **Database Setup**
   ```bash
   docker-compose up -d postgres redis
   npx prisma migrate dev
   npx prisma generate
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start Development**
   ```bash
   npm run dev
   ```

5. **Setup AI Service**
   ```bash
   cd ai-service
   pip install -r requirements.txt
   python main.py
   ```

This comprehensive backend will provide all the functionality needed for your AI-powered agricultural platform, including robust disease detection, community features, real-time notifications, and scalable architecture for production deployment.