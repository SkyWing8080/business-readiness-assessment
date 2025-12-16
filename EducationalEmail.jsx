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

export default function EducationalEmail({ name, email, percentage }) {
  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.greeting}>Hi {name},</Text>

          <Text style={styles.paragraph}>
            Yesterday we shared your transformation readiness results ({percentage}% score). 
            Today, let's talk about something more important than technology: <strong>asking 
            the right questions before you invest</strong>.
          </Text>

          <Text style={styles.heading}>The Three Questions Framework</Text>

          <Text style={styles.paragraph}>
            After helping dozens of mid-market companies navigate transformation, we've learned 
            that success comes down to three strategic questions. Answer these clearly, and 
            technology decisions become straightforward.
          </Text>

          <Section style={styles.questionBox}>
            <Text style={styles.questionNumber}>Question 1:</Text>
            <Text style={styles.questionText}>
              What specific business problem are we solving?
            </Text>
            <Text style={styles.questionExplanation}>
              Not "we need to modernize" or "competitors are doing AI." What's the quantified 
              business pain? Revenue leakage from manual processes? Customer churn from slow 
              response times? Margin erosion from pricing blind spots?
            </Text>
            <Text style={styles.questionExample}>
              <strong>Example:</strong> A beverage distributor we worked with said "we need AI." 
              After digging, the real problem was: sales reps spending 4 hours/day on manual 
              order entry = 25% capacity lost = S$450K in unrealized revenue annually.
            </Text>
          </Section>

          <Section style={styles.questionBox}>
            <Text style={styles.questionNumber}>Question 2:</Text>
            <Text style={styles.questionText}>
              How will we measure success, and do we have baseline data?
            </Text>
            <Text style={styles.questionExplanation}>
              If you can't measure the current state, you can't prove ROI. And if leadership 
              can't see ROI, they won't approve the investment. Simple as that.
            </Text>
            <Text style={styles.questionExample}>
              <strong>The trap:</strong> Companies say "we'll measure customer satisfaction." 
              But you don't have current CSAT scores. So six months later, you can't prove 
              anything improved. Budget gets cut.
            </Text>
          </Section>

          <Section style={styles.questionBox}>
            <Text style={styles.questionNumber}>Question 3:</Text>
            <Text style={styles.questionText}>
              Is our organization ready to change how we work?
            </Text>
            <Text style={styles.questionExplanation}>
              Technology is the easy part. Change management is where most initiatives fail. 
              Do you have executive sponsorship? Team capacity? Appetite for process changes? 
              History of successful transformation?
            </Text>
            <Text style={styles.questionExample}>
              <strong>Red flag:</strong> If your answer is "we'll figure it out," you're not 
              ready. Successful transformations start with honest organizational assessment.
            </Text>
          </Section>

          <Text style={styles.heading}>What This Means for You</Text>

          <Text style={styles.paragraph}>
            Based on your {percentage}% readiness score, {
              percentage >= 70 
                ? "you're well-positioned to answer these questions. Your challenge is prioritization—which opportunities deliver the most value?"
                : percentage >= 50
                ? "you have some foundational work before major investments. The good news: answering these questions will reveal exactly what to strengthen first."
                : "you need strategic clarity before technology decisions. Starting with these questions helps you build a solid foundation."
            }
          </Text>

          <Text style={styles.paragraph}>
            In our next email, we'll show you how companies at your readiness level typically 
            move forward. And if you want to discuss your specific situation before then, 
            just reply to this email.
          </Text>

          <Text style={styles.signature}>
            Best regards,
            <br />Justin & Praveen
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
  questionBox: {
    backgroundColor: '#f8f9fa',
    padding: '24px',
    borderRadius: '6px',
    margin: '20px 0',
    borderLeft: '4px solid #0066cc',
  },
  questionNumber: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#0066cc',
    textTransform: 'uppercase',
    margin: '0 0 8px 0',
  },
  questionText: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#222222',
    margin: '0 0 12px 0',
  },
  questionExplanation: {
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#555555',
    margin: '12px 0',
  },
  questionExample: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#666666',
    fontStyle: 'italic',
    margin: '12px 0 0 0',
    paddingLeft: '12px',
    borderLeft: '2px solid #ddd',
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
