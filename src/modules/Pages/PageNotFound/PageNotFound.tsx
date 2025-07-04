import './pageNotFound.css'
import {useNavigate} from 'react-router-dom'

export const PageNotFound = () => {
    const navigate = useNavigate();
    return (
        <section className="page_404">
            <div className="container">
                <div className="row">
                    <div className="col-sm-12 ">
                        <div className="col-sm-10 col-sm-offset-1  text-center">
                            <div className="four_zero_four_bg">
                                <h1 className="text-center ">404</h1>


                            </div>

                            <div className="contant_box_404">
                                <h3 className="h2">
                                    Похоже, вы заблудились
                                </h3>

                                <p>страница, которую вы ищете, недоступна!</p>

                                <button onClick={() => navigate(-1)} className="link_404">Вернуться назад</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

