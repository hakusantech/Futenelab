import Container from "@/app/_components/container";
import { EXAMPLE_PATH } from "@/lib/constants";
import { CATEGORIES } from "@/lib/categories";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200">
      <Container>
        <div className="py-16 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              Futene Tech Lab
            </h3>
            <p className="text-gray-600 mb-4">
              東大発スタートアップFutene Web Designが運用するテックメディアです。
              Web開発とAIに関する最新情報を届け、テクノロジーの最前線をわかりやすく解説します。
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com/SaitoMai383768" className="text-gray-500 hover:text-blue-500">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">カテゴリ</h4>
            <ul className="space-y-2">
              {CATEGORIES.map((category) => (
                <li key={category.id}>
                  <Link 
                    href={`/categories/${category.id}`} 
                    className="text-gray-600 hover:text-blue-500"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">リンク</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-600 hover:text-blue-500">ホーム</Link></li>
              <li><Link href="/posts" className="text-gray-600 hover:text-blue-500">記事一覧</Link></li>
              <li><a href="https://futene-web-design.jp" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-500">Futene Web Design</a></li>
              <li><a href="https://futene-web-design-dev.vercel.app/contact" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-500">お問い合わせ</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">プライバシーポリシー</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 py-8 text-center text-gray-500">
          <p>© {new Date().getFullYear()} Futene Tech Lab. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
