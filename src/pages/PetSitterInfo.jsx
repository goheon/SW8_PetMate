import Footer from '../components/Footer';
import Header from '../components/Header';
import './Notfound.scss';

function Notfound() {
  return (
    <>
      <Header />
      <section className="notfound">
        <div className="notfound_inner">
          <h1>잘못된 페이지입니다.</h1>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Notfound;
