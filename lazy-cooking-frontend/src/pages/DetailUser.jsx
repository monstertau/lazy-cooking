import React, { Component } from 'react';
import './DetailUser.css'
class DetailUser extends Component {
    render() {
        return (
            <div class="container">
                <div class="row">
                    <div >
                        <div >
                            <div class="row">
                                <div >
                                    <img src="http://ctt-sis.hust.edu.vn/Content/Anh/anh_20176671.jpg" alt="" class="img-rounded img-responsive" />
                                </div>
                                <div id="clear">
                                    <h4>
                                        Bhaumik Patel</h4>
                                    <small><cite title="San Francisco, USA">San Francisco, USA <i class="glyphicon glyphicon-map-marker">
                                    </i></cite></small>
                                    <p>
                                        <i class="glyphicon glyphicon-envelope"></i>email@example.com
                                        <br />
                                        <i class="glyphicon glyphicon-globe"></i><a href="http://www.jquery2dotnet.com">www.jquery2dotnet.com</a>
                                        <br />
                                        <i class="glyphicon glyphicon-gift"></i>June 02, 1988</p>

                                    <div class="btn-group">
                                        <button type="button" class="btn btn-primary">
                                            Social</button>
                                        <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                                            <span class="caret"></span><span class="sr-only">Social</span>
                                        </button>
                                        <ul class="dropdown-menu" role="menu">
                                            <li><a href="#">Twitter</a></li>
                                            <li><a href="https://plus.google.com/+Jquery2dotnet/posts">Google +</a></li>
                                            <li><a href="https://www.facebook.com/jquery2dotnet">Facebook</a></li>
                                            <li class="divider"></li>
                                            <li><a href="#">Github</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default DetailUser;