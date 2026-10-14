
import { Fragment } from "react";
import Header from "../shared/header/header";
import { Outlet } from "react-router-dom";

const Mainlayout = () => {
  return (
    <Fragment>
      <Header />

      <main>
        <Outlet />
      </main>
    </Fragment>
  );
};

export default Mainlayout;
