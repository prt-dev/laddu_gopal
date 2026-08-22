import { siteConfig } from "../../config/site";

export default function ContactSection() {
  return (
    <div className="container-fluid contact py-5">
      <div className="container py-5">
        <div className="p-5 bg-light rounded">
          <div className="row g-4">
            {/* Header Text */}
            <div className="col-12">
              <div className="text-center mx-auto" style={{ maxWidth: 700 }}>
                <h1 className="text-primary fw-bold">Get in Touch with {siteConfig.name}</h1>
                <p className="mb-4 text-muted">
                  Have questions about publishing on BlogVerse, editorial guidelines, partnerships, or writer sponsorships? Reach out to our team anytime!
                </p>
              </div>
            </div>

            {/* Google Map */}
            <div className="col-lg-12">
              <div className="h-100 rounded">
                <iframe
                  className="rounded w-100"
                  style={{ height: 350 }}
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100939.98555098464!2d-122.5076401799795!3d37.757814996609724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div className="col-lg-7">
              <form action="">
                <input
                  type="text"
                  className="w-100 form-control border-0 py-3 mb-4 shadow-sm"
                  placeholder="Your Full Name"
                />
                <input
                  type="email"
                  className="w-100 form-control border-0 py-3 mb-4 shadow-sm"
                  placeholder="Your Email Address"
                />
                <textarea
                  className="w-100 form-control border-0 mb-4 shadow-sm"
                  rows={5}
                  cols={10}
                  placeholder="Your Editorial Inquiry, Story Pitch, or Message"
                />
                <button
                  className="w-100 btn form-control border-secondary py-3 bg-white text-primary fw-bold"
                  type="submit"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="col-lg-5">
              <div className="d-flex p-4 rounded mb-4 bg-white">
                <i className="fas fa-map-marker-alt fa-2x text-primary me-4" />
                <div>
                  <h4>Office Address</h4>
                  <p className="mb-2">{siteConfig.address}</p>
                </div>
              </div>
              <div className="d-flex p-4 rounded mb-4 bg-white">
                <i className="fas fa-envelope fa-2x text-primary me-4" />
                <div>
                  <h4>Mail Us</h4>
                  <p className="mb-2">
                    <a href={`mailto:${siteConfig.email}`} className="text-dark">{siteConfig.email}</a>
                  </p>
                </div>
              </div>
              <div className="d-flex p-4 rounded bg-white">
                <i className="fa fa-phone-alt fa-2x text-primary me-4" />
                <div>
                  <h4>Call Us</h4>
                  <p className="mb-1">
                    <a href={`tel:${siteConfig.phone1}`} className="text-dark">{siteConfig.phone1}</a>
                  </p>
                  <p className="mb-0">
                    <a href={`tel:${siteConfig.phone2}`} className="text-dark">{siteConfig.phone2}</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
