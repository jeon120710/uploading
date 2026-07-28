import { AiNovelGenerator } from "@/components/AiNovelGenerator";

export default function AiGeneratorPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">AI 소설 생성</h1>
      <AiNovelGenerator />
    </div>
  );
}
