const { OpenAI } = require('openai');

// Initialize OpenAI client if key is present
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} else {
  console.warn('WARNING: OPENAI_API_KEY is not defined. Platform will run in Mock AI mode.');
}

/**
 * Generate mock questions when OpenAI is unavailable
 */
const getMockQuestions = (role, difficulty, experienceLevel) => {
  const mockDatabase = {
    'Frontend': {
      'Easy': [
        'Explain the difference between let, const, and var.',
        'What is the Virtual DOM in React and how does it work?',
        'How do you handle responsiveness in CSS?',
        'Explain event bubbling and event capturing in JavaScript.',
        'What are semantic HTML tags and why are they important?'
      ],
      'Medium': [
        'Explain the React rendering lifecycle and how to optimize it.',
        'How do you manage global state in a large React application? Compare Redux and Context API.',
        'What is a Closure in JavaScript? Give a practical use case.',
        'What is CORS, and how do you resolve CORS errors in web development?',
        'Explain the difference between client-side rendering (CSR) and server-side rendering (SSR).'
      ],
      'Hard': [
        'Explain React Fiber architecture and how it schedules rendering tasks.',
        'Describe how you would design a scalable, accessible design system from scratch.',
        'What are Web Workers? How do you leverage them to optimize heavy calculations in React?',
        'How would you handle web security issues like XSS, CSRF, and clickjacking in a React frontend?',
        'Explain the inner workings of JavaScript execution context and event loop with macro/micro tasks.'
      ]
    },
    'Backend': {
      'Easy': [
        'What is Node.js, and how does its event-driven architecture work?',
        'Explain the differences between SQL and NoSQL databases.',
        'What are the standard HTTP status codes and what do they represent?',
        'What is REST API? List some REST design principles.',
        'What is the purpose of package.json and package-lock.json files?'
      ],
      'Medium': [
        'How does middleware work in Express.js? Write a custom logging middleware.',
        'Describe how to handle authentication and session management using JWT.',
        'What are database indexes, and how do they improve query performance? Are there downsides?',
        'Explain the concepts of connection pooling and why it is useful.',
        'How do you handle errors gracefully in an Express.js application?'
      ],
      'Hard': [
        'Design a system architecture that handles high write traffic (e.g., ticket booking system).',
        'How does Node.js cluster module work, and how does it implement load balancing?',
        'Explain database sharding, replication, and CAP theorem in the context of system design.',
        'How would you prevent and mitigate DDoS attacks at the API level?',
        'Explain how you would implement database transactions across multiple collections in MongoDB.'
      ]
    },
    'React': {
      'Easy': [
        'What are React Hooks? List the basic hooks and their usages.',
        'What is JSX and is it compiled? If so, to what?',
        'What are controlled vs uncontrolled components in React?',
        'What is the purpose of keys in React lists?',
        'Explain the difference between Props and State.'
      ],
      'Medium': [
        'What is custom React Hook? Create a hook that tracks window size changes.',
        'Explain React.memo, useMemo, and useCallback. When should you NOT use them?',
        'How do you implement code splitting and lazy loading in React?',
        'What is the difference between class-based and functional React components?',
        'Explain React Context API. How do you prevent unnecessary re-renders when context values change?'
      ],
      'Hard': [
        'Explain the reconciliation algorithm in React 18+.',
        'How would you build a React micro-frontend architecture?',
        'What is Concurrent Mode and Suspense in React? How does it affect data fetching?',
        'Explain how you would profile React application performance using the DevTools Profiler.',
        'How do you write unit and integration tests for hooks and async components in React?'
      ]
    }
  };

  // Find matching questions or default to a standard set
  const roleKey = Object.keys(mockDatabase).find(r => r.toLowerCase() === role.toLowerCase()) || 'Frontend';
  const diffKey = Object.keys(mockDatabase[roleKey]).find(d => d.toLowerCase() === difficulty.toLowerCase()) || 'Medium';
  
  return mockDatabase[roleKey][diffKey];
};

/**
 * Generate AI-based interview questions
 */
const generateQuestions = async (role, difficulty, experienceLevel, count = 5) => {
  if (!openai) {
    console.log('Using Mock Service for Question Generation');
    return getMockQuestions(role, difficulty, experienceLevel).slice(0, count);
  }

  try {
    const prompt = `Generate exactly ${count} interview questions for a ${experienceLevel} ${role} role at ${difficulty} difficulty.
Return ONLY a valid JSON array of strings containing the questions. Do not include any markdown format tags like \`\`\`json or standard text explanations. Output must be raw JSON. Example:
["Question 1", "Question 2", "Question 3"]`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const content = response.choices[0].message.content.trim();
    // Parse JSON
    // Clean potential markdown wrap if OpenAI ignores instruction
    const jsonStr = content.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('OpenAI generateQuestions error:', error);
    return getMockQuestions(role, difficulty, experienceLevel).slice(0, count);
  }
};

/**
 * Analyze resume text for skills and ATS rating
 */
const analyzeResume = async (resumeText, targetRole = 'Software Engineer') => {
  if (!openai) {
    console.log('Using Mock Service for Resume Analysis');
    // Extract some mock skills based on text content
    const standardSkills = ['javascript', 'react', 'node', 'express', 'mongodb', 'html', 'css', 'python', 'java', 'sql', 'git', 'docker', 'aws'];
    const foundSkills = [];
    standardSkills.forEach(skill => {
      if (resumeText.toLowerCase().includes(skill)) {
        foundSkills.push(skill.toUpperCase());
      }
    });

    if (foundSkills.length === 0) {
      foundSkills.push('JAVASCRIPT', 'REACT', 'HTML', 'CSS', 'GIT');
    }

    const atsScore = Math.min(60 + foundSkills.length * 4, 98);
    const feedback = [
      'Your resume contains key skills matching software engineering positions.',
      'To increase your ATS score, consider adding metrics showing the impact of your projects (e.g., "improved loading speed by 30%").',
      'Ensure standard structural sections like "Experience", "Projects", "Education", and "Skills" are clearly formatted.',
      'We recommend detailing database technologies and cloud providers if you have experience with AWS or MongoDB.'
    ];

    return { atsScore, skills: foundSkills, feedback };
  }

  try {
    const prompt = `Analyze the following resume text for a target role of "${targetRole}". Extract the core skills, compute a simulated ATS match score (0-100), and generate 3-5 constructive suggestions for optimization.
Return ONLY a valid JSON object matching the following schema. Do not include markdown formatting like \`\`\`json.
{
  "atsScore": 85,
  "skills": ["React", "Node.js", "Docker"],
  "feedback": [
    "Quantify your experience (e.g., improved load time by 20%)",
    "List databases utilized in projects"
  ]
}

Resume Text:
${resumeText}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
    });

    const content = response.choices[0].message.content.trim();
    const jsonStr = content.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('OpenAI analyzeResume error:', error);
    return {
      atsScore: 70,
      skills: ['JAVASCRIPT', 'REACT', 'NODE.JS', 'CSS', 'HTML'],
      feedback: [
        'OpenAI API limit or key issue. Falling back to local analyzer.',
        'Add quantitative metrics like conversion rate, user growth, or performance gains.',
        'Highlight standard technical keywords related to the job description.'
      ]
    };
  }
};

/**
 * Evaluate answer using OpenAI
 */
const evaluateAnswer = async (question, answer, role, difficulty) => {
  if (!openai) {
    console.log('Using Mock Service for Answer Evaluation');
    // Calculate a basic score based on response length and keyword matching
    let score = 50;
    const cleanAnswer = answer.toLowerCase();

    // Check length
    if (cleanAnswer.length > 50) score += 10;
    if (cleanAnswer.length > 150) score += 15;
    if (cleanAnswer.length > 300) score += 10;

    // Check role-based keywords to simulate technical depth
    const techKeywords = ['virtual dom', 'closure', 'middleware', 'indexing', 'async', 'promise', 'database', 'hooks', 'optimization', 'state', 'component', 'api', 'schema', 'authentication'];
    let matches = 0;
    techKeywords.forEach(kw => {
      if (cleanAnswer.includes(kw)) {
        matches++;
      }
    });
    score += Math.min(matches * 5, 20);
    score = Math.min(score, 98);

    if (cleanAnswer.trim() === '') {
      score = 0;
    }

    let commFeedback = 'Good flow, but could be structured better using the STAR format (Situation, Task, Action, Result) for behavioral aspects, or structural definition for technical items.';
    let technicalFeedback = 'Includes basic definitions. To raise your score, define the specific mechanisms (such as compiler behavior or runtime execution details).';
    let suggestions = 'Practice describing coding concepts aloud. Start with a 1-sentence summary, dive into technical details, and end with a practical application or coding example.';

    if (score < 40) {
      commFeedback = 'The answer was very brief or not provided. Try to expand with definitions and examples.';
      technicalFeedback = 'Lacks details. Explain the core mechanism and how you use it in actual programs.';
      suggestions = 'Outline key definitions first. Write out your talking points before recording your speech next time.';
    }

    return {
      score,
      commFeedback,
      technicalFeedback,
      suggestions
    };
  }

  try {
    const prompt = `Evaluate the candidate's answer for the following question. 
Role: ${role}
Difficulty: ${difficulty}
Question: ${question}
Candidate's Answer: ${answer}

Provide an evaluation consisting of:
- A numeric score (0 to 100)
- Communication feedback (how well they articulated the answer)
- Technical feedback (correctness and depth of knowledge)
- Concrete improvement suggestions

Return ONLY a valid JSON object matching the following schema. Do not write markdown tags like \`\`\`json.
{
  "score": 85,
  "commFeedback": "Excellent communication and vocabulary...",
  "technicalFeedback": "Technically sound, correctly defined closure but missed event loop implications...",
  "suggestions": "Try to explain garbage collection in closure scopes to display senior-level awareness."
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
    });

    const content = response.choices[0].message.content.trim();
    const jsonStr = content.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('OpenAI evaluateAnswer error:', error);
    return {
      score: 75,
      commFeedback: 'Communication is concise but can be expanded with real-world examples.',
      technicalFeedback: 'Identified the core components but lacked deep analysis of edge cases or underlying architecture.',
      suggestions: 'Always start with the core definition, explain the how/why, and provide a quick personal project context where you utilized this concept.'
    };
  }
};

module.exports = {
  generateQuestions,
  analyzeResume,
  evaluateAnswer
};
