import axios from 'axios';
import React, { Component } from 'react';
import { Container, Table } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { baseUrl } from '../../../assets/data/api';
import { newArrivals } from '../../../assets/data/data';

class AllProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            filteredProducts: []
        }
        this.handleDelete = this.handleDelete.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        axios.get(baseUrl + "/api/products")
            .then(res => {
                console.log(res.data);
                this.setState({ products: res.data, filteredProducts: res.data })
            })
    }
    handleDelete(id) {
        const remainingProducts = this.state.filteredProducts.filter(pd => pd._id !== id)
        this.setState({
            filteredProducts: remainingProducts
        })
        axios.delete(baseUrl + `/api/products/${id}`, {
            headers: {
                token: `Bearer ${this.props.user.user.accessToken}`
            }
        })
            .then(res => console.log(res.data),)
    }
    handleChange(e) {
        console.log(e.target.value);
        console.log(this.state.filteredProducts);
        const products = this.state.products.filter(pd => pd.title.toLowerCase().includes(e.target.value.toLowerCase()))
        this.setState({
            filteredProducts: products
        })
    }
    handleSubmit(e) {
        const products = this.state.filteredProducts.filter(pd => pd.title.includes(e.target.value))
        this.setState({
            filteredProducts: products
        })
    }

    render() {
        return (
            <div>
                <Container className='my-5'>
                    <p>All Products</p>
                    <form onSubmit={e => this.handleSubmit(e)} class="input-group mb-3 px-5 w-50 m-auto">

                        <input onChange={e => this.handleChange(e)} type="text" class="form-control" placeholder="Search for product" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                        <span class="input-group-text" id="basic-addon2"><i className="bi bi-search pointer text-dark"></i></span>
                    </form>
                    <Table striped responsive>
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th className='text-center'>Action</th>
                            </tr>
                        </thead>
                        {
                            this.state.filteredProducts.map((na, index) => <tbody>
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{na.title}</td>
                                    <td>{na.category}</td>
                                    <td>&euro;{na.price}</td>
                                    <td>
                                        <span className='mx-2'>
                                            <Link className='text-decoration-none pointer text-dark' to={`${na._id}`}><i className="bi bi-pencil"></i>Edit</Link>
                                        </span>
                                        <span className='pointer text-dark' onClick={() => this.handleDelete(na._id)}>
                                            <i className="bi bi-trash pointer text-dark"></i>Delete
                                        </span>
                                    </td>
                                </tr>
                            </tbody>)
                        }
                    </Table>
                </Container>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user
})
export default connect(mapStateToProps)(AllProducts);
