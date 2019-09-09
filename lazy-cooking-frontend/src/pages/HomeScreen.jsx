import React from "react";
import { Carousel, Row } from "antd";
import { Button, Input, Menu, Dropdown, Icon, Avatar, List } from "antd";
import "antd/dist/antd.css";
import "./HomeScreen.css"

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
)

class HomeScreen extends React.Component {

  handleBuaSang = () => {
    window.location.replace("http://localhost:3000/create-recipe");
  }
  
  render() {
    return (
      <div className="container" style={{ marginTop: "20px" }}>

        <Carousel autoplay>
          <div className="intro">
            <img src="https://static.toiimg.com/photo/68283907.cms" className="imageCarousel" />
          </div>
          <div>
            <img src="https://static.toiimg.com/photo/68283907.cms" className="imageCarousel" />
          </div>
          <div>
            <img src="https://static.toiimg.com/photo/68283907.cms" className="imageCarousel" />
          </div>
          <div>
            <img src="https://static.toiimg.com/photo/68283907.cms" className="imageCarousel" />
          </div>
        </Carousel>

        <div className="meal-time mt-5">
          <div className="title-meal">
            <h4>
              <hr />BẠN MUỐN TÌM GÌ<hr />
            </h4>
          </div>

          <div className="row row-meal text-center">
            <div className="col-4 sang">
              <div>
                <img className="image-meal" src="https://food-images.files.bbci.co.uk/food/recipes/veggie_breakfast_fry_up_66913_16x9.jpg" alt="" />
              </div>
              <button className="btn-sang" ><a className="a-sang" href="/recipe/bua-sang">Bữa sáng</a></button>
            </div>

            <div className="col-4">
              <div>
                <img className="image-meal" src="https://www.dineout.co.in/blog/wp-content/uploads/2018/07/blog-banner-copy-1-1030x538.png" alt="" />
              </div>
              <button className="btn-sang" ><a className="a-sang" href="/recipe/bua-trua">Bữa trưa</a></button>
            </div>

            <div className="col-4">
              <div>
                <img className="image-meal" src="https://www.rd.com/wp-content/uploads/2017/11/there-s-actually-a-difference-between-dinner-and-supper_440843308-pressmaster-760x506.jpg" alt="" />
              </div>
              <button className="btn-sang" ><a className="a-sang" href="/recipe/bua-toi">Bữa tối</a></button>
            </div>
          </div>
        </div>
        <br/><br/><hr/>

        <div className="new-post mt-5">
          <div className="title-new-post">
            <h4 className="ml-2">Bài viết mới nhất</h4>
          </div>
          <div className="new-post">
            
          </div>
        </div>
      </div>
    );
  }
}

export default HomeScreen;
