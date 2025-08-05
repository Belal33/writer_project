import json
from google import genai
from google.genai import types
from typing import List, Dict
from .types import (
    BaseGenerationModel,
    ChatCompletionResponse,
    TextEmbeddingResponse,
    SuggestDescriptionsResponse,
)
from .prompts import (
    CREATE_TEXT_CONTENT,
    SUGGEST_DESCRIPTIONS_SYSTEM_MESSAGE,
    CREATE_OUTLINE_SYSTEM_MESSAGE,
    TEXT_COMPLETION_SYSTEM_MESSAGE,
    TEXT_IMPROVEMENT_SYSTEM_MESSAGE,
)
from .system_context.descriptions_creation import DESCRIPTIONS_CREATION_CONTEXT
from environs import Env

env = Env()
env.read_env()

GEMINI_KEY = env.str("GEMINI_KEY")


def prepare_gemini_chat_content(messages: List[Dict[str, str]]):
    gemini_messages = []
    for message in messages:
        if message["role"] == "system":
            raise ValueError("system message not allowed")
        if message["role"] == "user":
            gemini_messages.append(
                types.Content(role="user", parts=[{"text": message["content"]}])
            )
        if message["role"] == "assistant":
            gemini_messages.append(
                types.Content(role="model", parts=[{"text": message["content"]}])
            )
    return gemini_messages


class GeminiModel(BaseGenerationModel):
    """Concrete class for Gemini models."""

    api_key = GEMINI_KEY
    default_model = "gemini-2.5-flash"
    client_class = genai.Client
    available_models = ["gemini-2.0-flash", "gemini-2.5-flash","gemini-2.5-pro"]
    audio_transcription_model = "gemini-2.5-flash"
    default_embedding_model = "text-embedding-004"
    # default_embedding_model = "gemini-embedding-001"

    def chat_completion(
        self, messages: List[Dict[str, str]], system_message: str = None
    ) -> ChatCompletionResponse:
        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=prepare_gemini_chat_content(messages),
                config=types.GenerateContentConfig(system_instruction=system_message),
            )
            return ChatCompletionResponse(
                text=response.text,
                prompt_tokens=response.usage_metadata.prompt_token_count,
                completion_tokens=response.usage_metadata.candidates_token_count,
                total_tokens=response.usage_metadata.total_token_count,
                finish_reason=response.candidates[0].finish_reason,
                model=self.model,
            )
        except Exception as e:
            raise RuntimeError(f"Gemini API error: {e}")

    def streamed_chat_completion(
        self, messages: List[Dict[str, str]], system_message: str = ""
    ):
        try:
            response = self.client.models.generate_content_stream(
                model=self.model,
                contents=prepare_gemini_chat_content(messages),
                config=types.GenerateContentConfig(system_instruction=system_message),
            )

            for chunk in response:
                yield ChatCompletionResponse(
                    text=chunk.text,
                    prompt_tokens=chunk.usage_metadata.prompt_token_count,
                    completion_tokens=chunk.usage_metadata.candidates_token_count,
                    total_tokens=chunk.usage_metadata.total_token_count,
                    finish_reason=chunk.candidates[0].finish_reason,
                    model=self.model,
                )
        except Exception as e:
            raise RuntimeError(f"Gemini API error: {e}")

    def audio_transcription(self, audio_file):
        try:
            response = self.client.models.generate_content(
                model=self.audio_transcription_model,
                contents=[
                    types.Part.from_bytes(
                        data=audio_file.read(),
                        mime_type=audio_file.content_type,
                    )
                ],
                config=types.GenerateContentConfig(
                    system_instruction="you will recieve a audio file your job is to transcribe it to text"
                ),
            )

            return ChatCompletionResponse(
                text=response.text,
                prompt_tokens=response.usage_metadata.prompt_token_count,
                completion_tokens=response.usage_metadata.candidates_token_count,
                total_tokens=response.usage_metadata.total_token_count,
                finish_reason=response.candidates[0].finish_reason,
                model=self.audio_transcription_model,
            )
        except Exception as e:
            raise RuntimeError(f"Gemini API error: {e}")

    
    def suggest_descriptions(
        self,
        article_title: str,
    ) -> SuggestDescriptionsResponse:
        response = self.client.models.generate_content(
            model= self.model,
            contents=article_title,
            config={
                "system_instruction": SUGGEST_DESCRIPTIONS_SYSTEM_MESSAGE,
                "response_mime_type": "application/json",
                "response_schema": list[str],
            },
        )
        data = json.loads(response.text)
        print(data)
        return SuggestDescriptionsResponse(
            descriptions=data,
            total_tokens=response.usage_metadata.total_token_count,
            model=self.model,
        )

    def genereate_article_outline(self, article_title: str, description: str):
        res = self.client.models.generate_content(
            model=self.model,
            contents=f" Title: {article_title}\n Description: {description}",
            config={
                "system_instruction": CREATE_OUTLINE_SYSTEM_MESSAGE,
            },
        )
        return ChatCompletionResponse(
            text=res.text,
            model=self.model,
            prompt_tokens=res.usage_metadata.prompt_token_count,
            completion_tokens=res.usage_metadata.candidates_token_count,
            total_tokens=res.usage_metadata.total_token_count,
            finish_reason=res.candidates[0].finish_reason,
        )

    def text_completion(
        self, text: str, article_title: str, article_outline: str, max_tokens
    ):
        prompt = f" TEXT: '{text}' \n" + (
            f"Article Title: {article_title} \n Article Outline: {article_outline}"
            if article_outline
            else f"Article Title: {article_title}"
        )

        res = self.client.models.generate_content(
            model=self.model,
            contents=prompt,
            config={
                "max_output_tokens": max_tokens,
                "system_instruction": TEXT_COMPLETION_SYSTEM_MESSAGE,
            },
        )
        return ChatCompletionResponse(
            text=res.text,
            model=self.model,
            prompt_tokens=res.usage_metadata.prompt_token_count,
            completion_tokens=res.usage_metadata.candidates_token_count,
            total_tokens=res.usage_metadata.total_token_count,
            finish_reason=res.candidates[0].finish_reason,
        )

    def text_improvement(
        self,
        text: str,
    ):
        prompt = f"the piece of TEXT: '{text}' \n"
        res = self.client.models.generate_content(
            model=self.model,
            contents=prompt,
            config={
                "system_instruction": TEXT_IMPROVEMENT_SYSTEM_MESSAGE,
            },
        )
        return ChatCompletionResponse(
            text=res.text,
            model=self.model,
            prompt_tokens=res.usage_metadata.prompt_token_count,
            completion_tokens=res.usage_metadata.candidates_token_count,
            total_tokens=res.usage_metadata.total_token_count,
            finish_reason=res.candidates[0].finish_reason,
        )
    def text_embedding(self, text):
        res = self.client.models.embed_content(
            model=self.default_embedding_model, contents=text,
             config=types.EmbedContentConfig(
                output_dimensionality=768, task_type="RETRIEVAL_DOCUMENT"
            ),
        )

        return TextEmbeddingResponse(
            embedding=res.embeddings[0].values,
            model=self.default_embedding_model,
            total_tokens=0,
        )
    def text_embedding_chunks(self,chunks:list[str])-> list[TextEmbeddingResponse]:
        res = self.client.models.embed_content(
            model=self.default_embedding_model, contents=chunks,
             config=types.EmbedContentConfig(
                output_dimensionality=768, task_type="RETRIEVAL_DOCUMENT"
            ),
        )

        return [TextEmbeddingResponse(
            embedding=embedding.values,
            model=self.default_embedding_model,
            total_tokens=0,
        ) for  embedding in res.embeddings]

    def query_embedding(self, text)-> TextEmbeddingResponse:
        res = self.client.models.embed_content(
            model=self.default_embedding_model, contents=text,
            config=types.EmbedContentConfig(
                output_dimensionality=768, task_type="RETRIEVAL_QUERY"
            ),
        )
        return TextEmbeddingResponse(
            embedding=res.embeddings[0].values,
            model=self.default_embedding_model,
            total_tokens=0,
        )