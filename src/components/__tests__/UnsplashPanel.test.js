import React from "react";
import { render, wait, within, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UnsplashPanel from "../UnsplashPanel";

const mockData = {
  total_results: 2321,
  total_pages: 232,
  results: [
    {
      id: "1l2waV8glIQ",
      urls: {
        full:
          "https://images.unsplash.com/photo-1532386236358-a33d8a9434e3?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjY4MTA0fQ",
        thumb:
          "https://images.unsplash.com/photo-1532386236358-a33d8a9434e3?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjY4MTA0fQ"
      },
      alt_description:
        "selective focus photography brown cat lying over black cat"
    }
  ]
};

describe("UnsplashPanel", () => {
  it("given that a user clicks the search button then it should trigger a search", async () => {
    const searchUnsplash = jest.fn().mockResolvedValue(mockData);
    const { getByText } = render(
      <UnsplashPanel searchUnsplash={searchUnsplash} />
    );
    let searchButton;
    await wait(() => {
      searchButton = getByText("Search");
    });
    await act(async () => {
      await userEvent.click(searchButton);
    });
    expect(searchUnsplash).toHaveBeenCalledTimes(1);
  });

  it("given that a user triggers a search then it should display results", async () => {
    const searchUnsplash = jest.fn().mockResolvedValue(mockData);
    const { getByText, getByTestId } = render(
      <UnsplashPanel searchUnsplash={searchUnsplash} />
    );
    let searchButton;
    await wait(() => {
      searchButton = getByText("Search");
    });
    await act(async () => {
      await userEvent.click(searchButton);
    });
    let resultsContainer;
    await wait(() => {
      resultsContainer = getByTestId("search-results");
    });
    expect(resultsContainer.children).toHaveLength(1);
  });

  it("given that a user selects an orientation filter after doing a search then it should trigger a search", async () => {
    const searchUnsplash = jest.fn().mockResolvedValue(mockData);
    const { getByLabelText, getByText } = render(
      <UnsplashPanel searchUnsplash={searchUnsplash} />
    );
    let searchButton;
    await wait(() => {
      searchButton = getByText("Search");
    });
    await act(async () => {
      await userEvent.click(searchButton);
    });
    let orientationButton;
    await wait(() => {
      orientationButton = getByLabelText("Portrait");
    });
    await act(async () => {
      await userEvent.click(orientationButton);
    });
    expect(searchUnsplash).toHaveBeenCalledTimes(2);
  });

  it("given that a user navigates to the second page after doing a search then it should trigger a search", async () => {
    const searchUnsplash = jest.fn().mockResolvedValue(mockData);
    const { getByTestId, getByText } = render(
      <UnsplashPanel searchUnsplash={searchUnsplash} />
    );
    let searchButton;
    await wait(() => {
      searchButton = getByText("Search");
    });
    await act(async () => {
      await userEvent.click(searchButton);
    });
    let paginationComponent;
    let pageNumber;
    await wait(() => {
      paginationComponent = getByTestId("search-pagination");
    });
    pageNumber = within(paginationComponent).getByText("2");
    await act(async () => {
      await userEvent.click(pageNumber);
    });
    expect(searchUnsplash).toHaveBeenCalledTimes(2);
  });
});
