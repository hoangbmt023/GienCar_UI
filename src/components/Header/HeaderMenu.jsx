import racingImg from "../../assets/images/racing.jpg";
import sportscarImg from "../../assets/images/sports-car.jpg";
import collectionsImg from "../../assets/images/collections.jpg";
import experiencesImg from "../../assets/images/experiences.jpg";
import aboutusImg from "../../assets/images/about-us.jpg";

export const Header_Menu = [
  {
    label: "Racing",
    image: racingImg,
    children: [
      {
        label: "Formula 1",
        children: [
          "Home",
          "SF-24",
          "Team",
          "News",
          "Races",
          "Drivers",
          "Partners",
          "History"
        ]
      },
      {
        label: "Endurance",
        children: [
          "Overview",
          "499P Hypercar",
          "Drivers",
          "Calendar",
          "Results"
        ]
      },
      {
        label: "Ferrari Challenge",
        children: [
          "Overview",
          "Calendar",
          "Teams",
          "Drivers"
        ]
      },
      {
        label: "Driver Academy",
        children: [
          "Overview",
          "Drivers",
          "News"
        ]
      }
    ]
  },

  {
    label: "Sports Cars",
    image: sportscarImg,
    children: [
      {
        label: "Range",
        children: [
          "SF90 Stradale",
          "296 GTB",
          "Roma",
          "Purosangue",
          "812 Competizione"
        ]
      },
      {
        label: "Configure",
        children: [
          "Car Configurator",
          "Tailor Made",
          "Personalisation"
        ]
      },
      {
        label: "Ownership",
        children: [
          "Warranty",
          "Maintenance",
          "Roadside Assistance"
        ]
      }
    ]
  },

  {
    label: "Collections",
    image: collectionsImg,
    children: [
      {
        label: "Men",
        children: [
          "Clothing",
          "Shoes",
          "Accessories",
          "New Arrivals"
        ]
      },
      {
        label: "Women",
        children: [
          "Clothing",
          "Shoes",
          "Accessories",
          "New Arrivals"
        ]
      },
      {
        label: "Kids",
        children: [
          "Clothing",
          "Accessories"
        ]
      }
    ]
  },

  {
    label: "Experiences",
    image: experiencesImg,
    children: [
      {
        label: "Driving Experiences",
        children: [
          "Corso Pilota",
          "Track Days",
          "Driving Courses"
        ]
      },
      {
        label: "Museums",
        children: [
          "Maranello Museum",
          "Enzo Ferrari Museum"
        ]
      },
      {
        label: "Ferrari World",
        children: [
          "Abu Dhabi",
          "Theme Park"
        ]
      }
    ]
  },

  {
    label: "About Us",
    image: aboutusImg,
    children: [
      {
        label: "Company",
        children: [
          "History",
          "Innovation",
          "Design",
          "Manufacturing"
        ]
      },
      {
        label: "Media",
        children: [
          "News",
          "Press Releases",
          "Media Centre"
        ]
      },
      {
        label: "Careers",
        children: [
          "Work With Us",
          "Open Positions"
        ]
      }
    ]
  }
];