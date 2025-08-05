from scipy import spatial
from scipy import spatial
import re
from .generation_model import GenerationModel
from .gemini_model import GeminiModel

class EmbeddedChunk:

    def __init__(self, text, embedding=None, resource_name=None):

        self.paragraph: str = text
        self.embedding: list[float] = embedding
        self.resource_name: str = resource_name

    def __repr__(self) -> str:
        return f"Embedding(text='{self.paragraph[:20]}...', embedding_length={len(self.embedding) if self.embedding else None})"


class EmbeddingText:
    """Manages embedding of text, handling chunking and embedding calls."""

    CHUNK_SIZE = 1000  # Default chunk size in tokens
    MAX_CHUNK_TOKENS = 4000

    def __init__(
        self,
        text: str = "",
        embeddings: list = [],
        paragraphs: list = [],
        resource_name="",
    ):

        self.resource_name = resource_name
        self._chunks = None  # Use _chunks for internal representation

        if text:
            self._chunks = self._divide_and_embed(text)
        elif embeddings and paragraphs:
            self._chunks = [
                EmbeddedChunk(p, e, resource_name)
                for p, e in zip(paragraphs, embeddings)
            ]
        else:
            raise ValueError(
                "At least one of 'text', 'embeddings', or 'paragraphs' must be provided."
            )

    def __repr__(self):
        return str(self.chunks)

    # create iterator
    def __iter__(self):
        return iter(self.chunks)

    @property
    def chunks(self) -> list[EmbeddedChunk]:
        if self._chunks is None:
            raise ValueError(
                "Embeddings haven't been generated yet. Call generate_embeddings() first."
            )
        return self._chunks

    @property
    def embeddings(self):
        if self._chunks is None:
            raise ValueError(
                "Embeddings haven't been generated yet. Call generate_embeddings() first."
            )
        return [chunk.embedding for chunk in self.chunks]

    @property
    def paragraphs(self):

        if self._chunks is None:
            raise ValueError(
                "Embeddings haven't been generated yet. Call generate_embeddings() first."
            )
        return [chunk.paragraph for chunk in self.chunks]

    @classmethod
    def clean_and_split_strings(
        cls, string_list: list[str], chunk_size: int = 2000
    ) -> list[str]:
        """
        Cleans a list of strings by removing unnecessary whitespace and splitting strings
        longer than [chunk_size] words into multiple strings.

        Args:
            string_list: A list of strings to be cleaned and split.

        Returns:
            A new list of strings with unnecessary whitespace removed and strings
            split into chunks of at most 1000 words.
        """

        cleaned_strings = []
        for text in string_list:
            # Remove leading/trailing whitespace and reduce multiple spaces to single spaces
            cleaned_text = re.sub(r"\s+", " ", text).strip()
            # Split the cleaned text into words
            words = cleaned_text.split()
            # Split into chunks of chunk_size words or less
            for i in range(0, len(words), chunk_size):
                chunk = " ".join(words[i : i + chunk_size])
                cleaned_strings.append(chunk)
        return cleaned_strings

    def _divide_full_text(self, full_paragraph: str):
        """split text into paragraphs with maximum length of 1000 word"""

        splitted = re.split(".\n", full_paragraph)
        splitted = [p for p in splitted if len(p) >= 15]
        paragraphs = self.clean_and_split_strings(splitted)
        return paragraphs

    def _get_embeddings(self, paragraphs):
        embeddings = []
        # for _input in paragraphs:
        #     embed_req = GenerationModel().text_embedding(text=_input)["embedding"]
        #     embeddings.append(embed_req)
        embeddings =[emb["embedding"] for emb in GeminiModel().text_embedding_chunks(paragraphs)]

        return embeddings

    def _divide_and_embed(self, full_paragraph: str, resource_name=None):
        """
        estimated time of execution: 1 second per 5_000 token
        """
        paragraphs = self._divide_full_text(full_paragraph)
        embeddings = self._get_embeddings(paragraphs)
        return [
            EmbeddedChunk(para, emb, resource_name)
            for para, emb in zip(paragraphs, embeddings)
        ]


def sort_by_relatedness(
    query: str,
    array,
    relatedness_fn=lambda x, y: 1 - spatial.distance.cosine(x, y),
):
    """Returns a list of strings and relatednesses, sorted from most related to least."""

    query_embedding = GenerationModel().text_embedding(text=query)
    strings_and_relatednesses = [
        (
            i,
            relatedness_fn(
                query_embedding["embedding"],
                GenerationModel().text_embedding(text=i)["embedding"],
            ),
        )
        for i in array
    ]

    return sorted(strings_and_relatednesses, key=lambda x: x[1], reverse=True)
