"use client";
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { IoStar } from "react-icons/io5";
import { BsChatQuote } from "react-icons/bs";


const testimonials = [
  {
    name: "Aarav Sharma",
    review: "This platform exceeded my expectations in every way.\nThe user interface is smooth and easy to understand.\nOverall, it made my work faster and more efficient.",
    rating: 5
  },
  {
    name: "Nikhil Verma",
    review: "I really liked the design and responsiveness of the website.\nEverything loads quickly without any lag.\nCustomer support was also very helpful and polite.",
    rating: 4
  },
  {
    name: "Priya Patel",
    review: "The features provided are exactly what I needed.\nIt helped me organize my tasks better.\nI would definitely recommend it to others..\nNow it’s part of my daily routine.",
    rating: 5
  },
  {
    name: "Rohit Mehta",
    review: "At first I was confused, but the layout is very intuitive.\nAfter using it for a few days, I became comfortable.\nNow it’s part of my daily routine.",
    rating: 4
  },
  {
    name: "Sneha Kulkarni",
    review: "The overall experience has been really positive.\nI appreciate the attention to small details.\nIt clearly shows that a lot of effort went into this product.",
    rating: 5
  },
  {
    name: "Karan Singh",
    review: "The performance is reliable and consistent.\nI haven’t faced any major bugs so far.\nIt works exactly as advertised.\nThe updates also keep improving the experience.",
    rating: 4
  },
  {
    name: "Ananya Deshmukh",
    review: "I love how simple yet powerful this application is.\nIt saves a lot of time compared to other tools.\nThe updates also keep improving the experience.",
    rating: 5
  },
  {
    name: "Vikram Joshi",
    review: "This service offers great value for the price.\nThe features are well thought out and useful.\nI am satisfied with my decision to use it..\nIt saves a lot of time compared to other tools.",
    rating: 4
  },
  {
    name: "Pooja Malhotra",
    review: "The design looks modern and professional.\nNavigation between sections is very smooth.\nIt feels comfortable to use even for beginners.",
    rating: 5
  },
  {
    name: "Aditya Rao",
    review: "I had a great experience using this platform.\nEverything works smoothly without any issues.\nI would happily recommend it to my friends.",
    rating: 5
  }
];



const Testimonial = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          dots: true,
          infinite: true,
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          dots: false,
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div className="lg:px-32 px-4 sm:pt-20 pt-5 pb-10">
      <h2 className="text-center sm:text-4xl text-2xl mb-5 font-semibold">Customer Reviews</h2>
      <Slider {...settings}>
        {testimonials.map((item, index)=>(
          <div key={index} className="p-5">
            <div className='border rounded-lg p-5'>
              <BsChatQuote size={30} className="mb-3" />

            <p className="mb-5">{item.review}</p>
            <h4 className="font-semibold">{item.name}</h4>
            <div className="flex mt-1">
              {Array.from({length: item.rating}).map((_, i)=>(
                <IoStar  key={`star${i}`} className="text-yellow-400" size={20}/>
              ))}
            </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Testimonial;
