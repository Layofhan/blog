"use client";

import { useState, useRef, useEffect } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Link from "next/link";
import moment from "moment";

export default function HomePage({ articles, mostCommonTag }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);
  const [tabIndex, setTabIndex] = useState(0);

  const tabRefs = useRef([]);
  const [tabWidths, setTabWidths] = useState([]);
  const [tabPosition, setTabPosition] = useState(0);

  useEffect(() => {
    if (tabIndex !== 3) {
      setSearchQuery("");
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [tabIndex]);

  useEffect(() => {
    if (tabRefs.current.length > 0) {
      const widths = tabRefs.current.map((el) => el.offsetWidth);
      setTabWidths(widths);
      setTabPosition(tabRefs.current[tabIndex].offsetLeft);
    }
  }, [tabIndex]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const results = articles.filter(
      (article) =>
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.description.toLowerCase().includes(query.toLowerCase()) ||
        article.slug.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };

  const filteredArticles = (filter) => {
    const baseArticles =
      isSearching && searchQuery.trim()
        ? searchResults
        : filter === "featured"
          ? articles.filter((article) => article.featured)
          : filter === "tag"
            ? articles.filter((article) => article.tags.includes(mostCommonTag))
            : articles;
    return baseArticles.slice(0, visibleCount);
  };

  const renderArticles = (filter) =>
    filteredArticles(filter)
      .filter((post) => post.draft === false)
      .map((article, index) => (
        <div
          key={index}
          className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xs hover:shadow-md dark:shadow-zinc-700 transition px-6"
        >
          <Link href={article.slug}>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 py-1">
              {article.title}
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-7">
              {article.description.length > 100
                ? article.description.substring(0, 100) + "..."
                : article.description}
            </p>
          </Link>
          <div className="py-2 text-sm text-zinc-500 dark:text-zinc-400">
            <time>{moment(article.publishDate).format("LL")}</time>
            <span className="pl-1">
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  className="py-4 hover:text-zinc-800 dark:hover:text-zinc-200"
                  href={`/tags/${tag}`}
                >
                  <span className="hover:bg-zinc-100 rounded-md px-1 py-1 transition duration-500 dark:hover:bg-zinc-800">
                    {tag}
                  </span>
                </Link>
              ))}
            </span>
          </div>
        </div>
      ));

  const loadMoreButton = (filter) =>
    filteredArticles(filter).length >= visibleCount && (
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setVisibleCount((prev) => prev + 8)}
          className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 dark:bg-zinc-950 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-900 transition"
        >
          Load More
        </button>
      </div>
    );

  const tabButtonClass = ({ selected }) =>
    `relative z-10 px-2 py-2 text-sm font-medium rounded-md ${
      selected
        ? "text-zinc-900 dark:text-white"
        : "text-zinc-500 dark:text-zinc-300 hover:text-zinc-700 dark:hover:text-zinc-100"
    }`;

  return (
    <div className="w-full max-w-4xl">
      <TabGroup selectedIndex={tabIndex} onChange={setTabIndex}>
        <div>
          <TabList className="flex border-b   dark:border-zinc-800 border-zinc-200  pb-2 justify-between sticky top-0">
            {["Featured", "Latest", mostCommonTag, "Search"].map(
              (label, index) => (
                <Tab
                  key={index}
                  as="button"
                  ref={(el) => (tabRefs.current[index] = el)}
                  className={tabButtonClass}
                  onClick={
                    label === "Search" ? () => setIsSearching(true) : null
                  }
                >
                  {label}
                </Tab>
              )
            )}
            <div
              className="absolute bottom-0 h-1 bg-zinc-400 dark:bg-zinc-600 transition-all duration-300"
              style={{
                width: tabWidths[tabIndex] ? tabWidths[tabIndex] : "auto",
                transform: `translateX(${tabPosition}px)`,
              }}
            ></div>
          </TabList>
        </div>
        <TabPanels className="mt-6">
          {["featured", "latest", "tag", "search"].map((filter, index) => (
            <TabPanel key={index} className="space-y-6">
              {filter === "search" && isSearching && (
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full p-2 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-xs  focus:outline-hidden focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500"
                />
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderArticles(filter)}
              </div>
              {loadMoreButton(filter)}
            </TabPanel>
          ))}
        </TabPanels>
      </TabGroup>
    </div>
  );
}
