import { NextRequest, NextResponse } from "next/server";
import { FbFunnelRequest, FbFunnelResponse } from "@/types/voucher";

export async function POST(request: NextRequest) {
  try {
    const body: FbFunnelRequest = await request.json().catch(() => ({ affiliateLink: "" }));
    const affiliateLink = body?.affiliateLink?.trim();

    if (!affiliateLink) {
      return NextResponse.json(
        {
          success: false,
          error: "Vui lòng cung cấp link affiliate cần đăng vào Facebook Funnel.",
        },
        { status: 400 }
      );
    }

    const pageId = process.env.FB_PAGE_ID?.trim();
    const postId = process.env.FB_POST_ID?.trim();
    const accessToken = process.env.FB_PAGE_ACCESS_TOKEN?.trim();

    // Kiểm tra cấu hình Facebook
    if (!pageId || !postId || !accessToken) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Tính năng Facebook Funnel chưa được kích hoạt. Hãy cấu hình FB_PAGE_ID, FB_POST_ID và FB_PAGE_ACCESS_TOKEN trong file .env.local",
        },
        { status: 400 }
      );
    }

    // Gửi comment lên bài viết Fanpage qua Facebook Graph API v19.0
    const commentMessage = `🔥 Link mua săn sale & nhận voucher độc quyền: ${affiliateLink}`;
    const fbApiUrl = `https://graph.facebook.com/v19.0/${postId}/comments`;

    const fbResponse = await fetch(fbApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: commentMessage,
        access_token: accessToken,
      }),
    });

    const data = await fbResponse.json();

    if (!fbResponse.ok || !data.id) {
      const errorMsg =
        data?.error?.message || "Không thể gửi bình luận lên Facebook qua Graph API.";
      console.error("Facebook API error:", data);
      return NextResponse.json(
        {
          success: false,
          error: errorMsg,
        },
        { status: 500 }
      );
    }

    const commentId = data.id;
    // URL dẫn trực tiếp tới comment vừa được tạo trên bài viết Fanpage
    const fbCommentUrl = `https://www.facebook.com/${pageId}/posts/${postId}?comment_id=${commentId}`;

    const response: FbFunnelResponse = {
      success: true,
      fbCommentUrl,
      commentId,
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error("API /api/fb-funnel exception:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Lỗi kết nối khi gửi thông tin lên Facebook.",
      },
      { status: 500 }
    );
  }
}
