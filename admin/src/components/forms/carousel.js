import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import Container from "@material-ui/core/Container";
import { connect } from "react-redux";

const CarouselApp = (props) => {
  const {
    activity,
    match: {
      params: { id },
    },
  } = props;
  //   let act = state.activity;
  let a = activity.find((p) => p.id === parseInt(id));
  return (
    <Container>
      <Carousel autoPlay>
        {a.images.map(({ id, path }) => (
          <div>
            <img alt="" src={path} />
          </div>
        ))}
      </Carousel>
    </Container>
  );
};
const mapStateToProps = (state) => {
  return { activity: state.activity };
};

export default connect(mapStateToProps)(CarouselApp);
