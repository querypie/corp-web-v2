CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS ai_chat_unanswered_questions (
  id BIGSERIAL PRIMARY KEY,
  question_hash CHAR(64) NOT NULL,
  question TEXT NOT NULL,
  locale VARCHAR(2) NOT NULL CHECK (locale IN ('en', 'ko', 'ja')),
  reason VARCHAR(40) NOT NULL CHECK (reason IN ('no_relevant_source', 'model_insufficient_evidence', 'negative_feedback')),
  candidate_sources JSONB NOT NULL DEFAULT '[]'::jsonb,
  occurrence_count INTEGER NOT NULL DEFAULT 1 CHECK (occurrence_count > 0),
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'answered', 'ignored')),
  product VARCHAR(100),
  approved_answer TEXT,
  approved_source_url TEXT,
  answer_version INTEGER NOT NULL DEFAULT 0 CHECK (answer_version >= 0),
  reviewed_at TIMESTAMPTZ,
  UNIQUE (question_hash, locale)
);

ALTER TABLE ai_chat_unanswered_questions
  ADD COLUMN IF NOT EXISTS answer_version INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS ai_chat_unanswered_status_last_seen_idx
  ON ai_chat_unanswered_questions (status, last_seen_at DESC);

CREATE TABLE IF NOT EXISTS ai_chat_unanswered_events (
  id BIGSERIAL PRIMARY KEY,
  question_id BIGINT NOT NULL REFERENCES ai_chat_unanswered_questions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ai_chat_unanswered_events_created_idx
  ON ai_chat_unanswered_events (created_at DESC);

CREATE TABLE IF NOT EXISTS ai_chat_rate_limits (
  bucket_key CHAR(64) PRIMARY KEY,
  window_started_at TIMESTAMPTZ NOT NULL,
  request_count INTEGER NOT NULL CHECK (request_count > 0)
);

CREATE TABLE IF NOT EXISTS ai_chat_knowledge_chunks (
  chunk_id TEXT PRIMARY KEY,
  document_id TEXT NOT NULL,
  product VARCHAR(40) NOT NULL,
  locale VARCHAR(2) NOT NULL CHECK (locale IN ('en', 'ko', 'ja')),
  title TEXT NOT NULL,
  heading TEXT NOT NULL,
  source_url TEXT NOT NULL,
  source_visibility VARCHAR(20) NOT NULL CHECK (source_visibility IN ('public', 'approved')),
  content TEXT NOT NULL,
  content_hash CHAR(64) NOT NULL,
  embedding_model TEXT NOT NULL,
  embedding VECTOR(1024) NOT NULL,
  corpus_version CHAR(64) NOT NULL,
  source_collected_at TIMESTAMPTZ,
  indexed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ai_chat_knowledge_product_locale_idx
  ON ai_chat_knowledge_chunks (product, locale);

CREATE INDEX IF NOT EXISTS ai_chat_knowledge_embedding_hnsw_idx
  ON ai_chat_knowledge_chunks USING hnsw (embedding vector_cosine_ops);
