import React, { useState } from "react";
import _get from "lodash.get";
import { Pagination, Radio, Input, Spin } from "antd";
import { Box, Flex, Image } from "rebass";

const UnsplashPanel = ({ searchUnsplash }) => {
  const [filters, setFilters] = useState({
    term: "",
    page: "",
    orientation: "landscape"
  });
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async value => {
    const newFilters = { ...filters, term: value, page: 1 };
    setIsLoading(true);
    setFilters(newFilters);
    const results = await searchUnsplash(newFilters);
    setResults(results);
    setIsLoading(false);
  };

  const handleOrientationChange = async e => {
    const newFilters = { ...filters, page: 1, orientation: e.target.value };
    setIsLoading(true);
    setFilters(newFilters);
    const results = await searchUnsplash(newFilters);
    setResults(results);
    setIsLoading(false);
  };

  const handlePageChange = async page => {
    const newFilters = { ...filters, page };
    setIsLoading(true);
    setFilters(newFilters);
    const results = await searchUnsplash(newFilters);
    setResults(results);
    setIsLoading(false);
  };

  const imageList = _get(results, "results", []);
  const totalPages = _get(results, "total_pages", 1);

  return (
    <Box px={3} py={4} maxWidth="600px" m="auto">
      <Input.Search
        placeholder="Search for images"
        enterButton="Search"
        size="large"
        onSearch={handleSearch}
      />
      <Flex alignItems="center" flexDirection="column" px={3} py={4}>
        <Radio.Group
          onChange={handleOrientationChange}
          defaultValue={filters.orientation}
        >
          <Radio.Button value="landscape">Landscape</Radio.Button>
          <Radio.Button value="portrait">Portrait</Radio.Button>
          <Radio.Button value="squarish">Squarish</Radio.Button>
        </Radio.Group>
      </Flex>
      <Spin spinning={isLoading}>
        <Box
          data-testid="search-results"
          sx={{
            display: "grid",
            gridGap: 2,
            gridTemplateColumns: "repeat(3, 1fr)"
          }}
        >
          {imageList.map(image => {
            return (
              <Image
                key={_get(image, "id", "")}
                sx={{
                  borderRadius: 8
                }}
                alt={_get(image, "alt_description", "")}
                src={_get(image, "urls.thumb", "")}
              />
            );
          })}
        </Box>
        <Flex justifyContent="center">
          {imageList.length === 0 &&
            filters.term.length !== 0 &&
            !isLoading &&
            "No Results"}
        </Flex>
        <Flex
          justifyContent="center"
          data-testid="search-pagination"
          px={3}
          py={4}
        >
          {imageList.length !== 0 && (
            <Pagination
              defaultCurrent={filters.page}
              total={totalPages}
              current={filters.page}
              onChange={handlePageChange}
            />
          )}
        </Flex>
      </Spin>
    </Box>
  );
};

export default UnsplashPanel;
