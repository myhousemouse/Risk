package com.Ebiz.risk.data

import com.google.gson.annotations.SerializedName
import retrofit2.http.Body
import retrofit2.http.POST
import retrofit2.http.Query

data class GeminiRequest(
    val contents: List<Content>
)

data class Content(
    val parts: List<Part>
)

data class Part(
    val text: String
)

data class GeminiResponse(
    val candidates: List<Candidate>?
)

data class Candidate(
    val content: Content?,
    @SerializedName("finishReason") val finishReason: String?
)

interface GeminiService {
    // v1beta → v1로 변경, gemini-1.5-flash-latest → gemini-2.5-flash로 변경
    // 구글이 최근 모델 구성을 변경하여 gemini-1.5-flash-latest는 더 이상 지원하지 않음
    @POST("v1/models/gemini-2.5-flash:generateContent")
    suspend fun generateContent(
        @Query("key") apiKey: String,
        @Body request: GeminiRequest
    ): GeminiResponse
}

