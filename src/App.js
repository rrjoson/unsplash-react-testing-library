import React from "react";

import Unsplash from "unsplash-js";
import UnsplashPanel from "./components/UnsplashPanel";

const unsplash = new Unsplash({
  accessKey: process.env.REACT_APP_UNSPLASH_ACCESS_KEY
});

const searchUnsplash = async ({ term, page, orientation }) => {
  const response = await unsplash.search.photos(term, page, 9, {
    orientation: orientation
  });
  const json = await response.json();
  return json;
};

const App = () => <UnsplashPanel searchUnsplash={searchUnsplash} />;

export default App;
