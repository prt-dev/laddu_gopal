"use client";

import React, { useState } from "react";
import { BlogItem } from "@/app/services/blogService";
import { ClientItem } from "@/app/services/clientService";

interface BlogDetailProps {
  blog: BlogItem;
  client?: ClientItem | null;
}

export default function BlogDetail({ blog }: BlogDetailProps) {
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState([
    {
      name: "Radhika Sharma",
      date: "August 18, 2026",
      text: "Such divine insights on Thakur Ji's poshak and pagdi seva. Hare Krishna!",
    },
    {
      name: "Aman Agarwal",
      date: "August 19, 2026",
      text: "Very helpful guide on selecting poshak sizes according to idol dimensions.",
    },
  ]);
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;

    setCommentsList([
      ...commentsList,
      {
        name: commentName,
        date: "Just now",
        text: commentText,
      },
    ]);

    setCommentName("");
    setCommentText("");
    setSubmittedMessage(true);
    setTimeout(() => setSubmittedMessage(false), 4000);
  };

  return (
    <article className="rounded border border-[#fff0ad] bg-white p-6 sm:p-8">
      {/* Title & Metadata */}
      <div className="mb-6 border-b border-[#fff0ad] pb-4">
        <h1 className="heading-font text-2xl sm:text-3xl font-bold text-[#d20b4f] mb-3">
          {blog.title || "The Sacred Art of Laddu Gopal Shringar: Daily Seva Vidhi"}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-black">
          <span>
            <i className="fa fa-calendar-alt text-[#d20b4f] mr-1" />
            August 20, 2026
          </span>
          <span>
            <i className="fa fa-user text-[#d20b4f] mr-1" />
            Makhan Chor Devotees
          </span>
          <span>
            <i className="fa fa-comments text-[#d20b4f] mr-1" />
            {commentsList.length} Comments
          </span>
        </div>

        {blog.excerpt && (
          <p className="mt-4 rounded bg-[#fff0ad] p-3 text-sm font-bold text-black border-l-4 border-[#d20b4f]">
            {blog.excerpt}
          </p>
        )}
      </div>

      {/* Hero Image */}
      <div className="mb-6 overflow-hidden rounded">
        <img
          src="/assets/hero.png"
          alt={blog.title || "Laddu Gopal Shringar"}
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Article Content */}
      <div
        className="prose max-w-none text-sm leading-[1.6] text-black font-bold space-y-4"
        dangerouslySetInnerHTML={{
          __html:
            blog.content ||
            "<p>In Sanatan tradition, serving Laddu Gopal Ji is an intimate expression of Vatsalya Bhava (devotion). Adorning Thakur Ji with beautiful poshaks brings peace and joy to your home.</p>",
        }}
      />

      {/* Comments Section */}
      <div className="mt-10 border-t border-[#fff0ad] pt-6">
        <h3 className="heading-font text-xl font-bold text-[#d20b4f] mb-4">
          Devotee Comments ({commentsList.length})
        </h3>

        <div className="space-y-3 mb-8">
          {commentsList.map((c, idx) => (
            <div key={idx} className="rounded bg-[#fff0ad] p-4 text-black">
              <div className="flex justify-between items-center mb-1">
                <span className="heading-font text-sm font-bold text-[#d20b4f]">{c.name}</span>
                <span className="text-[11px] text-black">{c.date}</span>
              </div>
              <p className="text-xs text-black mb-0">{c.text}</p>
            </div>
          ))}
        </div>

        {/* Leave Comment Form */}
        <div className="rounded border border-[#fff0ad] bg-[#fff0ad] p-5">
          <h4 className="heading-font text-base font-bold text-[#d20b4f] mb-3">
            Leave a Devotional Comment
          </h4>

          {submittedMessage && (
            <div className="mb-3 rounded bg-green-100 p-2 text-xs font-bold text-green-800">
              Hare Krishna! Your comment has been shared.
            </div>
          )}

          <form onSubmit={handleAddComment} className="space-y-3">
            <div>
              <input
                type="text"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                placeholder="Your Name"
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs text-black focus:border-[#d20b4f] focus:outline-hidden"
                required
              />
            </div>

            <div>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Your Message or Seva Experience..."
                rows={3}
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-xs text-black focus:border-[#d20b4f] focus:outline-hidden"
                required
              />
            </div>

            <button
              type="submit"
              className="rounded bg-[#d20b4f] px-6 py-2 text-sm font-bold text-black transition hover:bg-[#b80943] border-0 cursor-pointer"
            >
              Post Comment
            </button>
          </form>
        </div>
      </div>
    </article>
  );
}
