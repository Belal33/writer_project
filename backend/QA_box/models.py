from django.db import models
from django.contrib.auth import get_user_model
from ai_writing_tools.models import Project
import uuid
from pgvector.django import VectorField
from pgvector.django import HnswIndex


class UploadedFile(models.Model):
    id = models.UUIDField(
        default=uuid.uuid4, unique=True, primary_key=True, editable=False
    )
    user = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE, related_name="uploadedFiles"
    )
    file = models.FileField(upload_to="uploads/")
    name = models.CharField(max_length=255, null=True)
    size = models.IntegerField(null=True)
    type = models.CharField(max_length=255, null=True)
    text = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


#################################
# Question Answering
#################################


class QABox(models.Model):
    id = models.UUIDField(
        default=uuid.uuid4, unique=True, primary_key=True, editable=False
    )
    user = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE, related_name="qaBoxes"
    )
    project = models.OneToOneField(
        Project, on_delete=models.CASCADE, related_name="qaBox", null=True
    )
    name = models.CharField(max_length=255)
    # resources = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name}|{ self.user.username}|{self.created_at}"


class Resource(models.Model):
    id = models.UUIDField(
        default=uuid.uuid4, unique=True, primary_key=True, editable=False
    )
    user = models.ForeignKey(
        get_user_model(),
        related_name="resources",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    projects = models.ManyToManyField(Project, related_name="resources")
    qaBoxes = models.ManyToManyField(QABox, related_name="resources")
    name = models.CharField(max_length=255)
    url = models.URLField(null=True, blank=True)
    text_source = models.TextField(  blank=True, null=True,
    )
    type = models.CharField(
        max_length=10,
        default="Text",
        choices=[
            ("text", "text"),
            ("wiki", "wiki"),
            ("pdf", "pdf"),
            ("youtube", "youtube"),
            ("audio", "audio"),
            ("video", "video"),
        ],
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]


class ResourceChunk(models.Model):
    id = models.UUIDField(
        default=uuid.uuid4, unique=True, primary_key=True, editable=False
    )
    resource = models.ForeignKey(
        Resource, on_delete=models.CASCADE, related_name="chunks"
    )
    text = models.TextField(editable=False)
    embedding = VectorField(dimensions=768, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            HnswIndex(
                fields=["embedding"],
                m=16,
                ef_construction=64,
                name="hnsw_index",
                # opclasses=["vector_cosine_ops"],
                opclasses=["vector_ip_ops"],
            ),
        ]

    def __str__(self):
        return f"{self.resource.name}|{self.text[:20]}|{self.created_at}"
# creaete signal the make chunks embeddings when resource is saved


class QAMessage(models.Model):
    id = models.UUIDField(
        default=uuid.uuid4, unique=True, primary_key=True, editable=False
    )
    user = models.ForeignKey(
        get_user_model(),
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="qamessages",
    )
    qaBox = models.ForeignKey(
        QABox,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="qamessages",
    )
    resource = models.ForeignKey(
        Resource, on_delete=models.SET_NULL, null=True, blank=True
    )
    answer = models.TextField()
    question = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
