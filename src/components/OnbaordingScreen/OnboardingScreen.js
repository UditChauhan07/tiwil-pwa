import React from "react";

import logo from '../../img/TiwilLOGO1.png'
import { Container, Row, Col } from 'react-bootstrap';
import '../OnbaordingScreen/Onboarding.css' // Import Bootstrap components
// import './Onboarding.css';

function OnboardingScreen() {
  return (
    <div style={{  }}>
      <Container fluid className="splash-container d-flex justify-content-center align-items-center" style={{ height: "100vh",  backgroundColor:"cornsilk" }}>
      
        <Row className="text-center">
          <Col>
            <img src={logo} alt="logo" className="splash-logo" height={"200px"} width={"200px"} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default OnboardingScreen;
