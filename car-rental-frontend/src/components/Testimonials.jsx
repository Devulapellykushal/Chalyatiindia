import React from "react";
import InfiniteScroll from './InfiniteScroll';

const testimonials = [
  {
    name: "Madhusudan",
    text: "Leased a premium car for my business—smooth process, no hidden charges, and very professional staff.",
    rating: 5,
    avatar: "👨‍💼"
  },
  {
    name: "Rahul",
    text: "As a PG student in Bangalore, the no-big-downpayment policy made it easy for me to lease a car affordably.",
    rating: 4.5,
    avatar: "👨‍🎓"
  },
  {
    name: "Midhun",
    text: "Needed a dependable car for my legal work. Chalyati delivered on time with excellent support and service.",
    rating: 5,
    avatar: "⚖️"
  },
  {
    name: "Sanjay Patel",
    text: "Chalyati offered reliable, well-maintained cars for my busy political schedule. Quick and stress-free service.",
    rating: 5,
    avatar: "👔"
  },
  {
    name: "Mahendar Reddy",
    text: "As a real estate agent, I value presentation. Chalyati gave me a stylish car with an easy lease process.",
    rating: 4.5,
    avatar: "🏠"
  },
  {
    name: "Kavya Mehta",
    text: "Booked through Chalyati for corporate travel. Cars are clean, punctual delivery, and support is always responsive.",
    rating: 5,
    avatar: "👩‍💼"
  },
  {
    name: "Arjun Nair",
    text: "As a consultant, I needed flexible rentals for client visits. Chalyati gave me the best pricing and hassle-free service.",
    rating: 4.5,
    avatar: "👨‍💼"
  },
  {
    name: "Deepika Rao",
    text: "Chalyati makes business trips simple. Professional service, great choice of vehicles, and smooth booking every time.",
    rating: 5,
    avatar: "👩‍💻"
  }
  
  
];

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="star-rating">
      {Array.from({ length: fullStars }).map((_, i) => (
        <span key={i} className="star">★</span>
      ))}
      {hasHalfStar && <span className="star half">☆</span>}
    </div>
  );
};

const TestimonialCard = ({ testimonial }) => (
  <div className="testimonial-card-infinite">
    <div className="testimonial-avatar">
      {testimonial.avatar}
    </div>
    
    <div className="testimonial-content">
      <StarRating rating={testimonial.rating} />
      
      <blockquote className="testimonial-text">
        "{testimonial.text}"
      </blockquote>
      
      <div className="testimonial-author">
        <strong>{testimonial.name}</strong>
      </div>
    </div>
  </div>
);

const Testimonials = () => {
  const items = testimonials.map((testimonial, index) => ({
    content: <TestimonialCard testimonial={testimonial} />
  }));

  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="testimonials-header">
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="testimonials-subtitle">Real reviews from satisfied customers</p>
        </div>

        <div className="testimonials-content">
          <div style={{height: '500px', position: 'relative'}}>
            <InfiniteScroll
              items={items}
              isTilted={true}
              tiltDirection='left'
              autoplay={true}
              autoplaySpeed={0.1}
              autoplayDirection="down"
              pauseOnHover={true}
              width="35rem"
              itemMinHeight={200}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
