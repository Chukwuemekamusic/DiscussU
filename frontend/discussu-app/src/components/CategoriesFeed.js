import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import '../css/Category.css'

const CategoriesFeed = ({ sortRoomsByCategory, categories }) => {
  return (
    <Container>
      <Row>
        <Col>
          <h3>
            <Link onClick={() => sortRoomsByCategory("")}>All</Link>
          </h3>
        </Col>
      </Row>

      <Row>
        {categories.map((category) => {
          // console.log('category id', category.id);
          return (
            <Col key={category.id} xs={6} md={4}>
              <div className="category-card">
                <h3>
                  <Link onClick={() => sortRoomsByCategory(category.name)}>
                    {category.name}
                  </Link>
                </h3>
              </div>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default CategoriesFeed;
