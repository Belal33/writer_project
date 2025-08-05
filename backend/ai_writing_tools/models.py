from django.db import models
from django.contrib.auth import get_user_model
import uuid


def get_default_article():
    return [{"text": ""}]


class Project(models.Model):
    id = models.UUIDField(
        default=uuid.uuid4, unique=True, primary_key=True, editable=False
    )
    user = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE, related_name="projects"
    )
    chatbox = models.OneToOneField(
        "ai_chat.ChatBox",
        on_delete=models.CASCADE,
        related_name="project",
    )
    lang = models.CharField(max_length=3, default="en")
    name = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    article = models.JSONField(default=get_default_article)
    article_text = models.TextField(default="")
    outline = models.JSONField(default=list)
    description = models.TextField(default="")
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    used_credits = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.name}|{ self.user.username}|{self.created_at}"

    class Meta:
        unique_together = ("name", "user")
        ordering = ["-created_at"]


class Excalidraw(models.Model):
    id = models.UUIDField(
        default=uuid.uuid4, unique=True, primary_key=True, editable=False
    )
    name = models.CharField(max_length=255)
    elements = models.JSONField(default=list)
    user = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE, related_name="excalidraws"
    )
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="excalidraws", null=True
    )
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    modified_at = models.DateTimeField(auto_now=True, null=True)


class TextImprovement(models.Model):
    id = models.UUIDField(
        default=uuid.uuid4, unique=True, primary_key=True, editable=False
    )
    user = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE, related_name="textimprovements"
    )
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="textimprovements"
    )
    used_credits = models.IntegerField(default=0)
    model_name = models.CharField(
        max_length=255,
        # choices=available_models._asdict(),
        # default=available_models.base_model,
    )
    improved_text = models.TextField()
    original_text = models.TextField()
    n_prompt_tokens = models.IntegerField(default=0)
    n_gen_tokens = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]


class TextCompletion(models.Model):

    id = models.UUIDField(
        default=uuid.uuid4, unique=True, primary_key=True, editable=False
    )
    user = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE, related_name="textcompletions"
    )
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="textcompletions",
        null=True,
        blank=True,
    )
    model_name = models.CharField(
        max_length=255,
        # choices=available_models._asdict(),
        # default=available_models.base_model,
    )
    is_sentence = models.BooleanField(default=False)
    original_text = models.TextField()
    completion_text = models.TextField(null=True)
    n_prompt_tokens = models.IntegerField(default=0)
    n_gen_tokens = models.IntegerField(default=0)
    used_credits = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
