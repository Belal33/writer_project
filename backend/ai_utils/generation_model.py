from typing import Literal, List, Dict
from .gemini_model import GeminiModel
from .openai_model import OpenaiModel


class GenerationModel:
    """Facade class for interacting with different AI models."""

    def __init__(
        self,
        provider: Literal["gemini", "openai"] = "gemini",
        model: str = "",
        api_key=None,
    ):
        self.provider = provider
        self.model = model
        self.api_key = api_key
        if provider == "openai":
            self.model_instance = OpenaiModel(model, api_key=api_key)
        elif provider == "gemini":
            self.model_instance = GeminiModel(model, api_key=api_key)
        else:
            raise ValueError(f"Invalid provider: {provider}")

    def chat_completion(self, messages: List[Dict[str, str]], system_message: str = ""):
        return self.model_instance.chat_completion(messages, system_message)

    def streamed_chat_completion(
        self, messages: List[Dict[str, str]], system_message: str = ""
    ):
        return self.model_instance.streamed_chat_completion(messages, system_message)

    def audio_transcription(self, audio_file):
        return self.model_instance.audio_transcription(audio_file)

    def text_embedding(self, text):
        return self.model_instance.text_embedding(text)

    def suggest_descriptions(self, article_title: str):
        return self.model_instance.suggest_descriptions(article_title=article_title)

    def genereate_article_outline(self, article_title: str, description: str):
        return self.model_instance.genereate_article_outline(
            article_title=article_title, description=description
        )

    def text_completion(
        self,
        text: str,
        article_title: str,
        article_outline: str = "",
        max_tokens: int = 3000,
    ):
        return self.model_instance.text_completion(
            text=text,
            article_outline=article_outline,
            article_title=article_title,
            max_tokens=max_tokens,
        )

    def text_improvement(
        self,
        text: str,
    ):
        return self.model_instance.text_improvement(
            text=text,
        )
