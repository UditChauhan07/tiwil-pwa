import React from "react";
import { Container, Row, Col } from 'react-bootstrap';
import '../OnbaordingScreen/Onboarding.css' // Import Bootstrap components
// import './Onboarding.css';

function OnboardingScreen() {
  return (
    <div style={{  }}>
      <Container fluid className="splash-container d-flex justify-content-center align-items-center" style={{ height: "80vh",   }}>
      
        <Row className="text-center">
          <Col>
            <img   src={`${process.env.PUBLIC_URL}/img/TiwilLOGO1.png`} alt="logo" className="splash-logo" height={"200px"} width={"200px"} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default OnboardingScreen;
