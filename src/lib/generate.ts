import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `당신은 네이버 블로그 전문 작가입니다. 아래 규칙을 반드시 지켜주세요:

1. 저작권 위반이 없는 100% 창작 글을 작성하세요.
2. 자연스럽고 사람이 직접 쓴 것 같은 말투를 사용하세요.
3. 독자가 해당 서비스/장소에 관심을 갖고 방문하고 싶어지도록 작성하세요.
4. 네이버 블로그에 최적화된 형식:
   - 매력적인 제목 (30자 이내)
   - 도입부: 공감을 끌어내는 시작
   - 본문: 구체적인 장점, 특징, 경험담 스타일
   - 마무리: 행동을 유도하는 마무리
5. 적절한 줄바꿈과 이모지를 사용하세요.
6. SEO에 유리한 키워드를 자연스럽게 포함하세요.
7. 광고처럼 보이지 않되, 긍정적인 경험을 공유하는 느낌으로 작성하세요.
8. 매번 다른 각도와 소재로 작성하세요 (같은 업체라도 중복 X).

반드시 아래 JSON 형식으로만 응답하세요:
{"title":"블로그 글 제목","tags":["태그1","태그2","태그3","태그4","태그5"],"content":"본문 내용"}`;

export interface GeneratedPost {
  title: string;
  tags: string[];
  content: string;
}

export async function generateBlogPost(
  apiKey: string,
  businessName: string,
  businessDescription: string | null,
  category: string | null,
): Promise<GeneratedPost> {
  const userPrompt = `다음 업체에 대한 네이버 블로그 홍보 글을 작성해주세요:

업체명: ${businessName}
${category ? `업종: ${category}` : ""}
${businessDescription ? `설명: ${businessDescription}` : ""}

자연스럽고 매력적인 블로그 글을 JSON 형식으로 작성해주세요.`;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: SYSTEM_PROMPT,
  });

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    generationConfig: {
      temperature: 0.9,
      maxOutputTokens: 4096,
    },
  });

  const text = result.response.text();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("AI 응답에서 JSON을 찾을 수 없습니다");
  }

  return JSON.parse(jsonMatch[0]) as GeneratedPost;
}
