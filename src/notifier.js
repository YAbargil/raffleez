import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
import hbs from "nodemailer-express-handlebars";
import path from "path";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASS,
  },
});

const handlebarOptions = {
  viewEngine: {
    extName: ".html",
    partialsDir: path.resolve("./views/"),
    defaultLayout: false,
  },
  viewPath: path.resolve("./views"),
  extName: ".handlebars",
};

transporter.use("compile", hbs(handlebarOptions));

export const notifyResults = async (participants, raffle, status) => {
  let template, subject;
  if (status === "W") {
    template = "winner";
    subject = "Congratulations 🎉";
  } else {
    template = `other`;
    subject = `${raffle.name} Giveaway Results`;
  }
  const { product } = raffle;
  let mail_config;
  participants.forEach(async (p) => {
    mail_config = {
      from: process.env.USER_EMAIL,
      to: p.email,
      subject: subject,
      template: template,
      context: {
        name: p.name,
        productname: product.name,
        rafflename: raffle.name,
        img: product.image,
      },
    };

    await transporter.sendMail(mail_config, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Email sent :" + info.response);
      }
    });
  });
};
