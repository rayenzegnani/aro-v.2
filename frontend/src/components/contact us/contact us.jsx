import React from "react";
import styled from "styled-components";
import { InnerLayout } from "../../styles/Layout";

function Contactus() {
    return (
        <ContactusStyled>
            <InnerLayout>
                <h2 className="title">Contact Us</h2>
                <form className="contact-form">
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" placeholder="Your Name" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" placeholder="Your Email" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea id="message" rows="5" placeholder="Your Message"></textarea>
                    </div>
                    <button type="submit" className="submit-btn">
                        Send Message
                    </button>
                </form>
            </InnerLayout>
        </ContactusStyled>
    );
}

const ContactusStyled = styled.div`
    .title {
        text-align: center;
        font-size: 2rem;
        margin-bottom: 2rem;
        color: #222260;
    }

    .contact-form {
        max-width: 600px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;

            label {
                font-size: 1rem;
                color: #222260;
            }

            input,
            textarea {
                padding: 0.8rem;
                border: 1px solid #ccc;
                border-radius: 5px;
                font-size: 1rem;
                outline: none;
                transition: border-color 0.3s ease;

                &:focus {
                    border-color: #222260;
                }
            }
        }

        .submit-btn {
            padding: 0.8rem 1.5rem;
            background: #222260;
            color: #fff;
            border: none;
            border-radius: 5px;
            font-size: 1rem;
            cursor: pointer;
            transition: background 0.3s ease;

            &:hover {
                background: #1a1a50;
            }
        }
    }
`;

export default Contactus;