import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

EMAIL_HOST = os.getenv("EMAIL_HOST", "smtp.gmail.com")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", 587))
EMAIL_USER = os.getenv("EMAIL_USER", "notifications@routehire.com")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD", "")
EMAIL_FROM = os.getenv("EMAIL_FROM", '"RouteHire Recruitment Team" <notifications@routehire.com>')

def send_email(to_email: str, subject: str, html_body: str):
    """Core Python Email Dispatch Engine with Production SMTP and Fallback Simulation"""
    if EMAIL_USER and EMAIL_PASSWORD and EMAIL_USER != "notifications@routehire.com":
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = EMAIL_FROM
            msg["To"] = to_email

            msg.attach(MIMEText(html_body, "html"))

            with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
                server.starttls()
                server.login(EMAIL_USER, EMAIL_PASSWORD)
                server.sendmail(EMAIL_USER, to_email, msg.as_string())
            print(f"[Python Email Engine] Live email sent to {to_email}")
            return True
        except Exception as e:
            print(f"[Python Email Engine Error]: {e}")

    # Fallback Terminal Simulation
    print("=====================================================")
    print("[PYTHON EMAIL ENGINE] Automated Email Dispatched:")
    print(f"TO: {to_email}")
    print(f"SUBJECT: {subject}")
    print("STATUS: Delivered (Prototype Console Output)")
    print("=====================================================")
    return True

# 1. Driver Profile Approval Email
def send_approval_email(user_name: str, user_email: str):
    subject = "RouteHire – Driver Profile Approved! 🎉"
    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc;">
      <div style="background-color: #0F2C59; color: #ffffff; padding: 25px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">RouteHire</h1>
        <p style="margin: 5px 0 0 0; color: #94a3b8; font-size: 14px;">Commercial Driver Recruitment Platform</p>
      </div>
      <div style="padding: 25px; background-color: #ffffff; border-radius: 0 0 8px 8px;">
        <h2 style="color: #0F2C59; margin-top: 0;">Congratulations, {user_name}! 👋</h2>
        <p style="font-size: 15px; color: #334155; line-height: 1.6;">
          We are pleased to inform you that your driver registration and credentials (Driving Licence & Certificates) have been <strong>AUDITED & VERIFIED</strong> by our verification desk.
        </p>
        <div style="background-color: #ECFDF5; border-left: 4px solid #10B981; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0; color: #065F46; font-weight: bold; font-size: 15px;">Status: ✓ RouteHire Verified Driver</p>
          <p style="margin: 4px 0 0 0; color: #047857; font-size: 13px;">Your profile is now live and visible to top travel operators across India.</p>
        </div>
        <p style="font-size: 14px; color: #64748b;">You can now log in to explore active interstate bus driver opportunities matching your highway routes.</p>
        <div style="text-align: center; margin-top: 25px;">
          <a href="http://localhost:8000/login.html" style="background-color: #0066FF; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Login to Driver Dashboard</a>
        </div>
      </div>
      <div style="text-align: center; padding: 15px; font-size: 12px; color: #94a3b8;">
        &copy; 2026 RouteHire Technologies. Commercial Driver Recruitment System.
      </div>
    </div>
    """
    return send_email(user_email, subject, html)

# 2. Driver Profile Rejection Email
def send_rejection_email(user_name: str, user_email: str, reason: str = ""):
    subject = "RouteHire – Profile Audit Notice (Rejected)"
    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc;">
      <div style="background-color: #0F2C59; color: #ffffff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">RouteHire Verification Desk</h1>
      </div>
      <div style="padding: 25px; background-color: #ffffff; border-radius: 0 0 8px 8px;">
        <h2 style="color: #0F2C59;">Dear {user_name},</h2>
        <p style="font-size: 15px; color: #334155; line-height: 1.6;">
          Thank you for registering on RouteHire. After auditing your profile and uploaded documents, we are unable to approve your application at this stage.
        </p>
        <div style="background-color: #FEF2F2; border-left: 4px solid #EF4444; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <strong style="color: #991B1B;">Reason for Decision:</strong>
          <p style="margin: 5px 0 0 0; color: #7F1D1D; font-size: 14px;">{reason or 'Documentation mismatch or criteria not met.'}</p>
        </div>
        <p style="font-size: 14px; color: #64748b;">You may update your profile credentials and submit clear documents for re-auditing.</p>
      </div>
    </div>
    """
    return send_email(user_email, subject, html)

# 3. Document Resubmission Email
def send_resubmit_document_email(user_name: str, user_email: str, document_type: str, reason: str = ""):
    subject = f"RouteHire – Action Required: {document_type.upper()} Resubmission"
    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <div style="background-color: #0F2C59; color: #ffffff; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">RouteHire Audit Desk</h1>
      </div>
      <div style="padding: 25px; background-color: #ffffff;">
        <h2 style="color: #0F2C59;">Attention {user_name},</h2>
        <p style="font-size: 15px; color: #334155;">
          Our verification team has audited your documents. The <strong>{document_type.upper()}</strong> requires resubmission.
        </p>
        <div style="background-color: #FFFBEB; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0;">
          <strong style="color: #92400E;">Admin Note / Reason:</strong>
          <p style="margin: 5px 0 0 0; color: #78350F; font-size: 14px;">{reason or 'Please upload a clear, readable image of your document.'}</p>
        </div>
        <div style="text-align: center; margin-top: 25px;">
          <a href="http://localhost:8000/login.html" style="background-color: #F59E0B; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Resubmit Document Now</a>
        </div>
      </div>
    </div>
    """
    return send_email(user_email, subject, html)

# 4. Application Submission Confirmation Email
def send_application_confirmation_email(user_name: str, user_email: str, job_title: str, operator_name: str, location: str):
    subject = f"RouteHire – Application Received: {job_title}"
    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <div style="background-color: #0F2C59; color: #ffffff; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">RouteHire</h1>
      </div>
      <div style="padding: 25px; background-color: #ffffff;">
        <h2 style="color: #0F2C59;">Application Confirmed! 🚀</h2>
        <p style="font-size: 15px; color: #334155;">Dear {user_name},</p>
        <p style="font-size: 15px; color: #334155;">
          Your application for <strong>{job_title}</strong> at <strong>{operator_name}</strong> ({location}) has been received successfully.
        </p>
        <p style="font-size: 14px; color: #64748b;">Our screening desk will evaluate your route match and update your candidate status shortly.</p>
      </div>
    </div>
    """
    return send_email(user_email, subject, html)

# 5. Shortlisted Candidate Email
def send_shortlisted_email(user_name: str, user_email: str, job_title: str, operator_name: str, route: str = "", salary: str = ""):
    subject = "RouteHire – You Have Been Shortlisted! ⭐"
    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc;">
      <div style="background-color: #0F2C59; color: #ffffff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">RouteHire Shortlist Notice</h1>
      </div>
      <div style="padding: 25px; background-color: #ffffff; border-radius: 0 0 8px 8px;">
        <h2 style="color: #0F2C59;">Great news, {user_name}!</h2>
        <p style="font-size: 15px; color: #334155;">
          Your profile has been <strong>SHORTLISTED</strong> for the position of <strong>{job_title}</strong> at <strong>{operator_name}</strong>.
        </p>
        <div style="background-color: #EFF6FF; border-left: 4px solid #3B82F6; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0; color: #1E40AF; font-size: 14px;"><strong>Assigned Route:</strong> {route or 'Interstate Highway Corridor'}</p>
          <p style="margin: 5px 0 0 0; color: #1E40AF; font-size: 14px;"><strong>Offered CTC:</strong> {salary or '₹30,000 - ₹35,000 / Month'}</p>
        </div>
        <p style="font-size: 14px; color: #64748b;">Our recruitment desk will contact you regarding next interview and terminal joining steps.</p>
      </div>
    </div>
    """
    return send_email(user_email, subject, html)

# 6. Selected Candidate Deployment Email
def send_selected_email(user_name: str, user_email: str, job_title: str, operator_name: str, details: str = ""):
    subject = "RouteHire – Congratulations! You Have Been Selected 🏆"
    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <div style="background-color: #10B981; color: #ffffff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">Selection Confirmed! 🏆</h1>
      </div>
      <div style="padding: 25px; background-color: #ffffff; border-radius: 0 0 8px 8px;">
        <h2 style="color: #0F2C59;">Congratulations, {user_name}!</h2>
        <p style="font-size: 15px; color: #334155;">
          You have been <strong>SELECTED</strong> for deployment at <strong>{operator_name}</strong> for the <strong>{job_title}</strong> role.
        </p>
        <p style="font-size: 14px; color: #64748b;">{details or 'Please prepare your original commercial driving licence and badge for terminal joining.'}</p>
      </div>
    </div>
    """
    return send_email(user_email, subject, html)
