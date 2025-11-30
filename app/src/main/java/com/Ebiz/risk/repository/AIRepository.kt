package com.Ebiz.risk.repository

import com.Ebiz.risk.data.Content
import com.Ebiz.risk.data.GeminiClient
import com.Ebiz.risk.data.GeminiRequest
import com.Ebiz.risk.data.Part
import com.Ebiz.risk.data.model.AIAction
import com.Ebiz.risk.data.model.RiskAction
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class AIRepository {
    private val geminiService = GeminiClient.service
    private val gson = Gson()

    suspend fun generateRiskActions(
        projectTitle: String,
        projectDescription: String,
        risks: List<Pair<Int, String>> // List of (riskId, riskName)
    ): Result<List<RiskAction>> = withContext(Dispatchers.IO) {
        try {
            val prompt = buildPrompt(projectTitle, projectDescription, risks)

            val request = GeminiRequest(
                contents = listOf(
                    Content(
                        parts = listOf(Part(text = prompt))
                    )
                )
            )

            val response = geminiService.generateContent(
                apiKey = GeminiClient.API_KEY,
                request = request
            )

            val responseText = response.candidates?.firstOrNull()?.content?.parts?.firstOrNull()?.text

            if (responseText != null) {
                val actions = parseGeminiResponse(responseText, risks)
                Result.success(actions)
            } else {
                Result.failure(Exception("AI 응답을 받지 못했습니다"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    private fun buildPrompt(
        projectTitle: String,
        projectDescription: String,
        risks: List<Pair<Int, String>>
    ): String {
        return """
당신은 프로젝트 리스크 관리 전문가입니다. 다음 프로젝트의 각 리스크에 대해 구체적인 실행 조치를 3개씩 제안해주세요.

**프로젝트 정보:**
- 제목: $projectTitle
- 설명: $projectDescription

**리스크 목록:**
${risks.joinToString("\n") { "${it.first}. ${it.second}" }}

**요구사항:**
각 리스크마다 정확히 3개의 실행 조치를 제안하고, 아래 JSON 형식으로만 응답해주세요. 다른 텍스트는 포함하지 마세요.

```json
[
  {
    "riskId": 1,
    "riskName": "리스크 이름",
    "actions": [
      {
        "title": "조치 제목 (한 줄)",
        "description": "구체적인 실행 방법 설명 (2-3문장)",
        "impact": "high|medium|low",
        "effort": "high|medium|low"
      }
    ]
  }
]
```

**조언 작성 가이드:**
- title: 15자 이내의 명확한 제목
- description: 실행 가능한 구체적 방법 (숫자, 기준 포함)
- impact: 리스크 감소 효과 (high/medium/low)
- effort: 실행에 필요한 노력/비용 (high/medium/low)
- 우선순위는 impact가 높고 effort가 낮은 순서로

JSON만 출력하세요.
        """.trimIndent()
    }

    private fun parseGeminiResponse(
        responseText: String,
        risks: List<Pair<Int, String>>
    ): List<RiskAction> {
        return try {
            // JSON 코드 블록 추출
            val jsonText = responseText
                .substringAfter("```json")
                .substringBefore("```")
                .trim()
                .takeIf { it.isNotEmpty() } ?: responseText.trim()

            val type = object : TypeToken<List<Map<String, Any>>>() {}.type
            val parsed: List<Map<String, Any>> = gson.fromJson(jsonText, type)

            parsed.map { riskMap ->
                val riskId = (riskMap["riskId"] as? Double)?.toInt() ?: 0
                val riskName = riskMap["riskName"] as? String ?: ""
                val actionsData = riskMap["actions"] as? List<Map<String, Any>> ?: emptyList()

                val actions = actionsData.map { actionMap ->
                    AIAction(
                        title = actionMap["title"] as? String ?: "",
                        description = actionMap["description"] as? String ?: "",
                        impact = parseImpact(actionMap["impact"] as? String),
                        effort = parseEffort(actionMap["effort"] as? String)
                    )
                }

                RiskAction(riskId, riskName, actions)
            }
        } catch (e: Exception) {
            // JSON 파싱 실패 시 기본 응답 제공
            createDefaultActions(risks)
        }
    }

    private fun parseImpact(value: String?): AIAction.Impact {
        return when (value?.lowercase()) {
            "high" -> AIAction.Impact.HIGH
            "medium" -> AIAction.Impact.MEDIUM
            "low" -> AIAction.Impact.LOW
            else -> AIAction.Impact.MEDIUM
        }
    }

    private fun parseEffort(value: String?): AIAction.Effort {
        return when (value?.lowercase()) {
            "high" -> AIAction.Effort.HIGH
            "medium" -> AIAction.Effort.MEDIUM
            "low" -> AIAction.Effort.LOW
            else -> AIAction.Effort.MEDIUM
        }
    }

    private fun createDefaultActions(risks: List<Pair<Int, String>>): List<RiskAction> {
        return risks.map { (riskId, riskName) ->
            RiskAction(
                riskId = riskId,
                riskName = riskName,
                actions = listOf(
                    AIAction(
                        title = "사전 검증 실시",
                        description = "리스크 발생 전 테스트 및 검증을 통해 사전에 문제를 파악하세요.",
                        impact = AIAction.Impact.HIGH,
                        effort = AIAction.Effort.MEDIUM
                    ),
                    AIAction(
                        title = "모니터링 시스템 구축",
                        description = "정기적으로 위험 지표를 측정하고 조기 경고 시스템을 마련하세요.",
                        impact = AIAction.Impact.HIGH,
                        effort = AIAction.Effort.LOW
                    ),
                    AIAction(
                        title = "대안 계획 수립",
                        description = "리스크 발생 시 대응할 수 있는 플랜 B를 미리 준비하세요.",
                        impact = AIAction.Impact.MEDIUM,
                        effort = AIAction.Effort.MEDIUM
                    )
                )
            )
        }
    }
}

