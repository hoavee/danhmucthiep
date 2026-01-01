// layout.js
import { Roboto, Great_Vibes } from "next/font/google"; // Thay Geist bằng Roboto
import "./globals.css";

// Cấu hình font Roboto
const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["vietnamese"], // Quan trọng: Thêm subset tiếng Việt
  variable: "--font-roboto",
});

const brandFont = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
});

export const metadata = {
  title: "Danh mục thiệp cưới",
  description: "Danh mục thiệp cưới",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      {/* Đổi thành vi cho chuẩn tiếng Việt */}
      <body className={`${roboto.variable} font-sans antialiased`}>
        <header className="w-full py-4 flex justify-center items-center bg-gray-100">
          <h1
            className={`${brandFont.className} text-3xl md:text-4xl text-[#8b5e3c]`}
          >
            Thiệp Cưới Linh Lam
          </h1>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}
