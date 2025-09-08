import React from "react";

const rows = [
  ["Zero Down Payment & Road Tax", "✓", "—"],
  ["No Financing Process", "✓", "—"],
  ["Cheaper than EMI", "✓", "—"],
  ["Annual Insurance Included", "✓", "—"],
  ["Free Service & Maintenance", "✓", "—"],
  ["Free 24×7 All-India RSA", "✓", "—"],
  ["End-to-End Warranty", "✓", "—"],
  ["Doorstep Pick & Drop (Service)", "✓", "—"],
  ["Hassle-Free Insurance Claims", "✓", "—"],
  ["Wide Range to Choose", "✓", "—"],
  ["Flexible Tenure & Easy Extension", "✓", "—"],
  ["No Dealer Visit at Purchase/Sale", "✓", "—"],
];

const SaveWithSubscription = () => (
  <section className="full-viewport">
    <h2 className="section-title">Save money with Chalyati Subscription</h2>
    <p className="hero-description" style={{ textAlign: "center", maxWidth: 900, margin: "0 auto 2rem" }}>
      Subscribing is flexible, convenient—and can cost less than buying on a loan.
    </p>

    <div className="table-wrap">
      <table className="bw-table">
        <thead>
          <tr>
            <th>Benefits</th>
            <th>Chalyati Subscription</th>
            <th>Buy</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>{r[0]}</td>
              <td className="ok">{r[1]}</td>
              <td className="no">{r[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
      <a href="/cars" className="btn btn-primary">Browse Cars</a>
    </div>
  </section>
);

export default SaveWithSubscription;
