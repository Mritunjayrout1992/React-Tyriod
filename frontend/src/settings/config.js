import Catalogue from "../component/Catalogue";

const config = {
    "LogoName" : "Tyriod Clothing",
    "Api" : {
        "BaseUrl": "http://localhost:8080/api",
        "Endpoints": {
            Login: "/login",
            Register: "/register",
            Catalogue: "/catalogue",
            CatalogueList : "/catalogueList",
            CatalogueListWithID : "/catalogue/id"
        }
    },
    "type":[{ label: "Men", id : 1, value: "men" },
        { label: "Women", id : 2, value: "women" },
        { label: "Kids", id : 3, value: "kids" }],
    "colorOptions": [
        { label: "Butter", value: "men" },
        { label: "Black", value: "women" },
        { label: "Sky", value: "kids" },
        { label: "Lt. Peach", value: "men" },
        { label: "Yellow", value: "women" },
        { label: "Lime", value: "kids" },
    ]
}

export default config;
