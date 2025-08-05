# import django logger
from rest_framework.generics import (
    GenericAPIView,
    CreateAPIView,
)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status

from ..pricing import Operations
from ..models import (
    Project,
    TextCompletion,
    TextImprovement,
)
from ..serializers import (
    TextImprovementSerializer,
    TextCompletionSerializer,
    ArticleOutlineSerializer,
    GetArticleDescriptionSerializer,
    SortByRelatednessSerializer,
)
from rest_framework.permissions import AllowAny
from ai_utils.generation_model import GenerationModel

# ** TODO **
# extract required params
# AI generation
# vlidate AI response
# extract validated Ai response
# Decrease user credits based on token usage


class SortByRelatednessView(GenericAPIView):
    serializer_class = SortByRelatednessSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return None

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data: dict = serializer.validated_data
        query = validated_data.get("query")
        data_array = validated_data.get("data_array")
        strings_and_relatednesses = sort_by_relatedness(query=query, array=data_array)
        return Response(
            strings_and_relatednesses,
            status=status.HTTP_200_OK,
        )


class GetArticleDescriptionView(APIView):
    """
    API view to suggest article descriptions based on a given article title.
    """

    serializer_class = GetArticleDescriptionSerializer

    @Operations.article_description.validate_user_credits
    def post(self, request: Request) -> Response:

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        title = serializer.validated_data["title"]

        try:
            # get user api key
            api_key = request.user.google_api_key

            model = GenerationModel()
            model.model_instance.api_key = api_key
            print(api_key)
            print(model.model_instance.api_key)
            suggested_content = model.suggest_descriptions(article_title=title)

            if not isinstance(suggested_content, dict):

                return Response(
                    {
                        "error": "Received an unexpected data structure from the generation model."
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

            descriptions_list = suggested_content.get("descriptions")

            if descriptions_list is None:

                return Response(
                    {
                        "error": "Failed to retrieve descriptions from the generation model's output."
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            # decrease user creadits
            total_tokens = suggested_content.get("total_tokens")
            Operations.article_description.get_user_payment(request, total_tokens)

            return Response(descriptions_list, status=status.HTTP_200_OK)
        except Exception as e:

            return Response(
                {
                    "error": f"An unexpected error occurred while generating descriptions .{e}"
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class ArticleOutlineView(APIView):
    """
    API view to generate an article outline based on a title and description.
    """

    serializer_class = ArticleOutlineSerializer

    @Operations.article_outline.validate_user_credits
    def post(self, request: Request) -> Response:
        """
        Handles POST requests to generate an article outline.

        Expects 'title' and optionally 'description' in the request data.
        Returns the generated outline text or an error response.
        """

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data
        title = validated_data["title"]
        description = validated_data.get("description")

        try:
            # get user api key
            api_key = request.user.google_api_key
            model = GenerationModel(api_key=api_key)
            outline_res = model.genereate_article_outline(
                article_title=title, description=description
            )
            if not isinstance(outline_res, dict) or "text" not in outline_res:
                return Response(
                    {
                        "error": "Received an unexpected data structure from the generation model."
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            outline_text = outline_res.get("text")
            total_tokens = outline_res.get("total_tokens")

            if outline_text is None:
                return Response(
                    {
                        "error": "Failed to retrieve outline text from the generation model's output."
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            Operations.article_description.get_user_payment(request, total_tokens)

            return Response(
                outline_text,
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return Response(
                {
                    "error": f"An unexpected error occurred while generating the outline. {e}"
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class TextCompletionView(CreateAPIView):
    serializer_class = TextCompletionSerializer

    def get_queryset(self):
        return TextCompletion.objects.filter(user=self.request.user)

    @Operations.completion.validate_user_credits
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data
        user_project: Project = validated_data.get("project")

        res = GenerationModel().text_completion(
            article_title=user_project and user_project.title,
            text=validated_data["original_text"],
        )
        completion_text = res["text"]
        n_gen_tokens = res["total_tokens"]
        n_prompt_tokens = res["prompt_tokens"]
        print(res)
        # claculate credits usage
        Operations.completion.get_user_payment(request, res["total_tokens"])
        used_credits = Operations.completion.calc_credits(res["total_tokens"])
        if user_project:
            user_project.used_credits += used_credits
            user_project.save()
        serializer.save(
            user=self.request.user,
            completion_text=completion_text,
            used_credits=used_credits,
            n_gen_tokens=n_gen_tokens,
            n_prompt_tokens=n_prompt_tokens,
            project=user_project,
        )
        headers = self.get_success_headers(serializer.data)
        return Response(
            {"completion_text": completion_text, "used_credits": used_credits},
            status=status.HTTP_201_CREATED,
            headers=headers,
        )


class TextImprovementView(CreateAPIView):
    """
    return text after improving it
    """

    serializer_class = TextImprovementSerializer

    def get_queryset(self):
        return TextImprovement.objects.filter(user=self.request.user)

    @Operations.improvement.validate_user_credits
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data
        user_project = None
        try:
            user_project = Project.objects.exists(
                user=self.request.user, id=validated_data["project"].id
            )
        except Project.DoesNotExist:
            return Response(
                {"detail": "Project not found."}, status=status.HTTP_404_NOT_FOUND
            )
        res = GenerationModel().text_improvement(
            text=validated_data["original_text"],
        )
        improved_text = res["text"]
        n_tokens = res["total_tokens"]
        used_credits = Operations.improvement.calc_credits(n_tokens)

        headers = self.get_success_headers(validated_data)

        serializer.save(
            user=self.request.user,
            improved_text=improved_text,
            used_credits=used_credits,
            n_tokens=n_tokens,
            project=user_project,
        )
        return Response(
            {"improved_text": improved_text, "used_credits": used_credits},
            status=status.HTTP_201_CREATED,
            headers=headers,
        )
