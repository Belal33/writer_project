from rest_framework import serializers
from .models import Project, TextImprovement, TextCompletion, Excalidraw


class ExcalidrawListCreateSerializer(serializers.ModelSerializer):

    def validate_project(self, value):
        request = self.context["request"]
        if value and (value.user != request.user):
            raise serializers.ValidationError(
                f'Invalid project id "{value.id}" - object does not exist.'
            )
        return value

    class Meta:
        model = Excalidraw
        fields = (
            "id",
            "user",
            "name",
            "project",
            "elements",
            "created_at",
            "modified_at",
        )
        read_only_fields = (
            "id",
            "user",
            "created_at",
            "modified_at",
        )


class ExcalidrawRetrieveUpdateDestroySerializer(serializers.ModelSerializer):
    class Meta:
        model = Excalidraw
        fields = (
            "id",
            "user",
            "project",
            "name",
            "elements",
            "created_at",
            "modified_at",
        )
        read_only_fields = (
            "name",
            "id",
            "user",
            "project",
            "created_at",
            "modified_at",
        )


class SortByRelatednessSerializer(serializers.Serializer):
    query = serializers.CharField(max_length=255)
    # language = serializers.CharField(max_length=2)
    data_array = serializers.ListField(
        child=serializers.CharField(max_length=255),
        allow_empty=False,
        min_length=2,
        max_length=50,
    )


class GetArticleDescriptionSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255, trim_whitespace=True, required=True)


class ArticleOutlineSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255, trim_whitespace=True, required=True)
    description = serializers.CharField(required=False)


class TextCompletionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TextCompletion
        read_only_fields = ("id", "user", "used_credits")
        fields = (
            "original_text",
            "project",
        )


class TextImprovementSerializer(serializers.ModelSerializer):

    class Meta:
        model = TextImprovement
        fields = (
            "original_text",
            "project",
        )
        read_only_fields = (
            "id",
            "user",
            "chatbox",
            "used_credits",
            "improved_text",
            "n_tokens",
        )


class ProjectListCreateSerializer(serializers.ModelSerializer):
    lang = serializers.ChoiceField(choices=[("en", "English"), ("ar", "Arabic")])
    used_credits = serializers.IntegerField(read_only=True)
    user_name = serializers.CharField(source="user.username", read_only=True)
    outline = serializers.JSONField(write_only=True, required=False)
    article_text = serializers.CharField(write_only=True, required=False)
    words_count = serializers.SerializerMethodField()
    description = serializers.CharField( required=False)

    def get_words_count(self, obj):
        return len(obj.article_text.split())

    # url = serializers.HyperlinkedRelatedField()

    class Meta:
        model = Project
        unique_together = ("user", "name")

        read_only_fields = (
            "id",
            "qaBox",
            "user",
            "chatbox",
            "used_credits",
        )
        fields = (
            "id",
            "lang",
            "words_count",
            "title",
            "article_text",
            "name",
            "chatbox",
            "qaBox",
            "description",
            "outline",
            "used_credits",
            "user_name",
            "created_at",
            "modified_at",
        )

    def validate_name(self, value):
        user = self.context["request"].user
        print(user)

        if Project.objects.filter(user=user, name=value).exists():
            raise serializers.ValidationError(
                "You already have a project with this name."
            )
        return value


class ProjectRetrieveUpdateDestroySerializer(serializers.ModelSerializer):
    lang = serializers.CharField(read_only=True)
    title = serializers.CharField(read_only=True)
    name = serializers.CharField(read_only=True)
    user_name = serializers.CharField(source="user.username", read_only=True)
    used_credits = serializers.IntegerField(read_only=True)
    article = serializers.JSONField()

    class Meta:
        model = Project
        fields = (
            "id",
            "lang",
            "title",
            "name",
            "chatbox",
            "qaBox",
            "article_text",
            "article",
            "description",
            "outline",
            "used_credits",
            "user_name",
            "excalidraws",
            "created_at",
            "modified_at",
        )
