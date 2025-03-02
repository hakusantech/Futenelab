import { CMS_NAME } from "@/lib/constants";

export function Intro() {
  return (
    <section className="flex flex-col items-center justify-center py-20 md:py-32 text-center bg-white">
      <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
        Futene Tech Lab
      </h1>
      <h2 className="text-2xl md:text-3xl font-medium mb-8 max-w-3xl text-gray-800">
        Web開発とAIに関する最新情報を届けるテックメディア
      </h2>
      <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-10">
        最新のWeb技術、フロントエンド開発、バックエンド、AI活用法、機械学習など、
        テクノロジーの最前線をわかりやすく解説します。
      </p>
      <div>
        <a
          href="#latest-articles"
          className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
        >
          最新記事を読む
        </a>
      </div>
    </section>
  );
}

export default Intro;
