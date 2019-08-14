import React from 'react';
import './App.css';
import { Table, Jumbotron, Container, Button, Modal } from 'react-bootstrap';
import axios from 'axios';

class App extends React.Component {
  state = {
    baseUrl: 'https://h10q0w44q8.execute-api.eu-west-2.amazonaws.com/dev',
    latest: [],
    errors: [],
    fetchErrors: [],
    showModal: false,
    details: {}
  }
  componentDidMount () {
    const { baseUrl } = this.state;

    return axios({
      method: 'get',
      url: `${baseUrl}/latest`
    })
      .then((response) => {
        // handle success
        this.setState(() => ({ latest: response.data.blocks || [] }));
      })
      .catch((err) => {
        // handle error
        this.setState(() => ({ errors: err }));
      })
  }

  handleShow = (d) => {
    this.fetchDetails(d);
  }

  handleClose = () => {
    this.setState(() => ({ showModal: false }));
  }

  fetchDetails = (hash) => {
    const { baseUrl } = this.state;

    axios({
      method: 'get',
      url: `${baseUrl}/details/${hash}`
    })
      .then((response) => {
        // handle success
        this.setState(() => ({ details: response.data || {} }))
      })
      .catch((err) => {
        // handle error
        this.setState(() => ({ errors: err }));
      })
      .finally(() => {
        this.setState(() => ({ showModal: true }));
      })
    
  }

  render () {
    const { latest, showModal, details } = this.state;
    let counter = 1;

    return (
      <div className="">
        <Modal size="lg" show={showModal} onHide={this.handleClose} animation={false}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Block Index</th>
                  <th>previous Hash</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{details.size}</td>
                  <td>{details.block_index}</td>
                  <td>{details.prev_block}</td>
                </tr>
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
          </Button>
            <Button variant="primary" onClick={this.handleClose}>
              Save Changes
          </Button>
          </Modal.Footer>
        </Modal>
        <Jumbotron fluid>
          <Container style={{ overflowY: "scroll", height:"400px" }}>
            <h2>Show Latest Blocks</h2>
            <p>Click on each row to view details</p>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Block Hash</th>
                  <th>Block Time</th>
                  <th>Block Height</th>
                </tr>
              </thead>
              <tbody>
                { 
                  latest.map(item => (
                    <tr key={item.time} onClick={() => this.handleShow(item.hash)}>
                      <td>{counter++}</td>
                      <td>{item.hash}</td>
                      <td>{item.time}</td>
                      <td>{item.height}</td>
                    </tr>
                  ))
                }
              </tbody>
            </Table>
          </Container>
        </Jumbotron>
      </div>
    );
  }
}

export default App;
