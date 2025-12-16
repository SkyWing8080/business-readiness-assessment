import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Section,
  Link,
  Hr,
} from '@react-email/components';

export default function WelcomeEmail({ name, email, percentage, readinessLevel, scores }) {
  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.greeting}>Hi {name},</Text>

          <Text style={styles.paragraph}>
            Thank you for completing our Business Transformation Readiness Assessment. 
            Your results show a readiness score of <strong>{percentage}%</strong> ({readinessLevel}).
          </Text>

          <Section style={styles.resultsBox}>
            <Text style={styles.resultsTitle}>Your Dimensional Scores:</Text>
            <Text style={styles.scoreItem}>• Data Infrastructure & Quality: {scores.data}/12</Text>
            <Text style={styles.scoreItem}>• Process Maturity: {scores.process}/12</Text>
            <Text style={styles.scoreItem}>• Team Capabilities: {scores.team}/12</Text>
            <Text style={styles.scoreItem}>• Strategic Readiness: {scores.strategic}/12</Text>
            <Text style={styles.scoreItem}>• Change Readiness: {scores.change}/12</Text>
          </Section>

          <Text style={styles.heading}>Why This Matters</Text>

          <Text style={styles.paragraph}>
            Here's what most AI consultants won't tell you: The technology part is actually 
            straightforward. What's hard is knowing which business problems to solve, building 
            cases that leadership approves, and navigating organizational change.
          </Text>

          <Text style={styles.paragraph}>
            That's where operators like us differ from career consultants. We've sat in your 
            chair. Between us, we have 50+ years leading commercial operations, building 
            digital capabilities from scratch, and driving transformation across Asia Pacific 
            for companies like Coca-Cola, GSK, Campari, and Philips.
          </Text>

          <Text style={styles.paragraph}>
            We've scaled e-commerce from zero across 6 Southeast Asia markets. We've 
            transformed 585-person sales forces. We've built pricing systems that delivered 
            double-digit margin improvements. And we've done it in organizations with limited 
            resources, budget constraints, and all the messy realities of mid-market operations.
          </Text>

          <Text style={styles.heading}>What Comes Next</Text>

          <Text style={styles.paragraph}>
            Over the next week, we'll send you a couple more emails with frameworks we use 
            to cut through AI confusion:
          </Text>

          <Text style={styles.paragraph}>
            • Strategic questions every business leader should ask before transformation
            <br />• How to build business cases that leadership actually approves
            <br />• Real examples from companies at your readiness level
          </Text>

          <Text style={styles.paragraph}>
            If you want to discuss your specific situation, just reply to this email. 
            We read every response.
          </Text>

          <Text style={styles.signature}>
            Best regards,
            <br />Justin Pher & Praveen Raman
            <br />Inflection Advisory
          </Text>

          <Hr style={styles.hr} />

          <Text style={styles.footer}>
            Inflection Advisory
            <br />contact@inflection-advisory.com
            <br /><Link href={`${process.env.NEXT_PUBLIC_APP_URL}/api/unsubscribe?email=${encodeURIComponent(email)}`} style={styles.link}>Unsubscribe</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: '#f4f4f4',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  container: {
    backgroundColor: '#ffffff',
    margin: '40px auto',
    padding: '40px',
    maxWidth: '600px',
    borderRadius: '8px',
  },
  greeting: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '0 0 20px 0',
  },
  paragraph: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#333333',
    margin: '16px 0',
  },
  heading: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#222222',
    margin: '30px 0 16px 0',
  },
  resultsBox: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '6px',
    margin: '20px 0',
  },
  resultsTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    margin: '0 0 12px 0',
  },
  scoreItem: {
    fontSize: '15px',
    lineHeight: '1.8',
    margin: '4px 0',
  },
  signature: {
    fontSize: '16px',
    lineHeight: '1.6',
    margin: '30px 0 20px 0',
  },
  hr: {
    borderColor: '#e0e0e0',
    margin: '30px 0',
  },
  footer: {
    fontSize: '12px',
    color: '#666666',
    lineHeight: '1.6',
    textAlign: 'center',
  },
  link: {
    color: '#0066cc',
    textDecoration: 'underline',
  },
};
