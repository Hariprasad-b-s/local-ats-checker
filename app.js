/**
 * ATS Resume Matcher - JavaScript Application
 * Analyzes job descriptions and resumes for ATS compatibility
 */

// Store missing keywords globally for copy functionality
let currentMissingKeywords = [];

/**
 * Copy missing keywords to clipboard
 */
async function copyMissingKeywords() {
    const copyBtn = document.getElementById('copyMissingBtn');
    const copyText = copyBtn.querySelector('.copy-text');

    if (currentMissingKeywords.length === 0) {
        return;
    }

    try {
        // Join keywords with comma and space
        const keywordsText = currentMissingKeywords.join(', ');
        await navigator.clipboard.writeText(keywordsText);

        // Show success state
        copyBtn.classList.add('copied');
        copyText.textContent = 'Copied!';

        // Reset after 2 seconds
        setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyText.textContent = 'Copy All';
        }, 2000);
    } catch (err) {
        console.error('Failed to copy:', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = currentMissingKeywords.join(', ');
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);

        copyBtn.classList.add('copied');
        copyText.textContent = 'Copied!';

        setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyText.textContent = 'Copy All';
        }, 2000);
    }
}

// Common keywords and skills organized by category
const keywordCategories = {
    programmingLanguages: [
        'javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin', 'go',
        'golang', 'rust', 'typescript', 'scala', 'perl', 'r', 'matlab', 'sql', 'html', 'css',
        'sass', 'less', 'bash', 'shell', 'powershell', 'objective-c', 'dart', 'lua', 'haskell',
        'clojure', 'elixir', 'erlang', 'f#', 'groovy', 'julia', 'vba', 'cobol', 'fortran'
    ],
    frameworks: [
        'react', 'angular', 'vue', 'vue.js', 'node.js', 'nodejs', 'express', 'express.js',
        'django', 'flask', 'spring', 'spring boot', 'springboot', '.net', 'asp.net', 'rails',
        'ruby on rails', 'laravel', 'symfony', 'nextjs', 'next.js', 'nuxt', 'nuxt.js', 'gatsby',
        'svelte', 'ember', 'backbone', 'jquery', 'bootstrap', 'tailwind', 'tailwindcss',
        'material-ui', 'mui', 'chakra', 'ant design', 'redux', 'mobx', 'graphql', 'apollo',
        'fastapi', 'nestjs', 'koa', 'hapi', 'strapi', 'electron', 'react native', 'flutter',
        'ionic', 'xamarin', 'unity', 'unreal', 'tensorflow', 'pytorch', 'keras', 'scikit-learn',
        'pandas', 'numpy', 'opencv', 'spark', 'hadoop', 'kafka', 'rabbitmq', 'celery'
    ],
    databases: [
        'mysql', 'postgresql', 'postgres', 'mongodb', 'redis', 'elasticsearch', 'oracle',
        'sql server', 'mssql', 'sqlite', 'dynamodb', 'cassandra', 'couchdb', 'firebase',
        'firestore', 'mariadb', 'neo4j', 'cockroachdb', 'timescaledb', 'influxdb', 'memcached',
        'supabase', 'planetscale', 'airtable'
    ],
    cloudPlatforms: [
        'aws', 'amazon web services', 'azure', 'microsoft azure', 'gcp', 'google cloud',
        'google cloud platform', 'heroku', 'digitalocean', 'linode', 'vultr', 'cloudflare',
        'vercel', 'netlify', 'firebase', 'alibaba cloud', 'ibm cloud', 'oracle cloud',
        'lambda', 'ec2', 's3', 'rds', 'cloudfront', 'route 53', 'ecs', 'eks', 'fargate',
        'sagemaker', 'redshift', 'kinesis', 'sqs', 'sns', 'cloudwatch'
    ],
    devOps: [
        'docker', 'kubernetes', 'k8s', 'jenkins', 'gitlab', 'github actions', 'circleci',
        'travis ci', 'ansible', 'terraform', 'puppet', 'chef', 'vagrant', 'nginx', 'apache',
        'tomcat', 'caddy', 'prometheus', 'grafana', 'datadog', 'splunk', 'elk', 'logstash',
        'kibana', 'new relic', 'pagerduty', 'opsgenie', 'helm', 'istio', 'envoy', 'consul',
        'vault', 'argocd', 'flux', 'spinnaker', 'ci/cd', 'cicd', 'continuous integration',
        'continuous deployment', 'continuous delivery', 'infrastructure as code', 'iac',
        'gitops', 'devsecops', 'site reliability', 'sre'
    ],
    softSkills: [
        'communication', 'leadership', 'teamwork', 'problem-solving', 'problem solving',
        'critical thinking', 'time management', 'adaptability', 'creativity', 'collaboration',
        'attention to detail', 'organizational', 'interpersonal', 'decision-making',
        'decision making', 'conflict resolution', 'emotional intelligence', 'mentoring',
        'coaching', 'presentation', 'negotiation', 'strategic thinking', 'analytical',
        'self-motivated', 'self motivated', 'proactive', 'initiative', 'multitasking',
        'prioritization', 'flexibility', 'resilience', 'empathy', 'listening'
    ],
    methodologies: [
        'agile', 'scrum', 'kanban', 'lean', 'waterfall', 'devops', 'tdd', 'bdd',
        'test-driven development', 'behavior-driven development', 'pair programming',
        'code review', 'sprint', 'standup', 'retrospective', 'user stories', 'epics',
        'mvp', 'minimum viable product', 'design thinking', 'ux', 'ui', 'user experience',
        'user interface', 'a/b testing', 'feature flags', 'microservices', 'monolithic',
        'serverless', 'event-driven', 'domain-driven design', 'ddd', 'clean architecture',
        'solid', 'dry', 'kiss', 'yagni'
    ],
    security: [
        'cybersecurity', 'security', 'authentication', 'authorization', 'oauth', 'jwt',
        'saml', 'sso', 'single sign-on', 'mfa', 'multi-factor', '2fa', 'encryption',
        'ssl', 'tls', 'https', 'penetration testing', 'pen testing', 'vulnerability',
        'owasp', 'firewall', 'vpn', 'ids', 'ips', 'siem', 'soc', 'compliance', 'gdpr',
        'hipaa', 'pci-dss', 'iso 27001', 'nist', 'zero trust'
    ],
    dataScience: [
        'machine learning', 'ml', 'deep learning', 'dl', 'artificial intelligence', 'ai',
        'neural networks', 'nlp', 'natural language processing', 'computer vision',
        'data science', 'data analysis', 'data analytics', 'data engineering', 'etl',
        'data pipeline', 'data warehouse', 'data lake', 'big data', 'statistics',
        'statistical analysis', 'predictive modeling', 'regression', 'classification',
        'clustering', 'recommendation systems', 'reinforcement learning', 'llm',
        'large language models', 'gpt', 'bert', 'transformers', 'feature engineering',
        'model deployment', 'mlops', 'a/b testing', 'experimentation'
    ],
    businessTerms: [
        'stakeholder', 'stakeholders', 'roi', 'kpi', 'okr', 'metrics', 'dashboard',
        'reporting', 'business intelligence', 'bi', 'crm', 'erp', 'saas', 'paas', 'iaas',
        'b2b', 'b2c', 'startup', 'enterprise', 'scale', 'scalability', 'growth',
        'revenue', 'conversion', 'retention', 'acquisition', 'product management',
        'product owner', 'roadmap', 'backlog', 'requirements', 'specifications',
        'documentation', 'technical writing', 'api documentation'
    ],
    experience: [
        'experience', 'years', 'year', 'senior', 'junior', 'mid-level', 'lead', 'principal',
        'staff', 'architect', 'manager', 'director', 'vp', 'cto', 'ceo', 'coo', 'cfo',
        'intern', 'internship', 'entry-level', 'entry level', 'professional', 'expert',
        'specialist', 'consultant', 'contractor', 'freelance', 'full-time', 'part-time',
        'remote', 'hybrid', 'on-site', 'onsite'
    ],
    education: [
        'bachelor', 'bachelors', "bachelor's", 'master', 'masters', "master's", 'phd',
        'doctorate', 'degree', 'computer science', 'cs', 'software engineering',
        'information technology', 'it', 'electrical engineering', 'mathematics',
        'statistics', 'physics', 'data science', 'certification', 'certified',
        'bootcamp', 'course', 'training', 'academic', 'university', 'college',
        'aws certified', 'azure certified', 'google certified', 'pmp', 'scrum master',
        'csm', 'comptia', 'cissp', 'ceh'
    ],
    tools: [
        'git', 'github', 'gitlab', 'bitbucket', 'svn', 'jira', 'confluence', 'trello',
        'asana', 'monday', 'notion', 'slack', 'teams', 'zoom', 'figma', 'sketch',
        'adobe xd', 'photoshop', 'illustrator', 'invision', 'zeplin', 'postman',
        'insomnia', 'swagger', 'openapi', 'vs code', 'visual studio', 'intellij',
        'pycharm', 'webstorm', 'eclipse', 'xcode', 'android studio', 'sublime',
        'vim', 'emacs', 'terminal', 'iterm', 'warp', 'docker desktop', 'lens'
    ]
};

// Stop words to filter out
const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
    'shall', 'can', 'need', 'dare', 'ought', 'used', 'this', 'that', 'these', 'those',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
    'my', 'your', 'his', 'its', 'our', 'their', 'mine', 'yours', 'hers', 'ours', 'theirs',
    'what', 'which', 'who', 'whom', 'whose', 'when', 'where', 'why', 'how', 'all', 'each',
    'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not',
    'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'also', 'now', 'here',
    'there', 'then', 'once', 'if', 'because', 'until', 'while', 'about', 'against',
    'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'up',
    'down', 'out', 'off', 'over', 'under', 'again', 'further', 'any', 'etc', 'via',
    'ie', 'eg', 'per', 'vs', 'including', 'within', 'without', 'along', 'across',
    'around', 'among', 'throughout', 'upon', 'toward', 'towards', 'besides', 'beyond', 'required',
    'respect', 'scale', 'related', 'empower', 'culture', 'growth'
]);

/**
 * Extract keywords from text
 */
function extractKeywords(text) {
    const lowerText = text.toLowerCase();
    const foundKeywords = new Set();

    // Check for multi-word keywords first
    Object.values(keywordCategories).flat().forEach(keyword => {
        if (keyword.includes(' ') || keyword.includes('.') || keyword.includes('-')) {
            if (lowerText.includes(keyword.toLowerCase())) {
                foundKeywords.add(keyword.toLowerCase());
            }
        }
    });

    // Extract single words
    const words = lowerText
        .replace(/[^\w\s.+-]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 1 && !stopWords.has(word));

    // Check single-word keywords
    const singleWordKeywords = Object.values(keywordCategories)
        .flat()
        .filter(k => !k.includes(' '));

    words.forEach(word => {
        const cleanWord = word.replace(/[^a-z0-9+#.]/g, '');
        if (singleWordKeywords.includes(cleanWord)) {
            foundKeywords.add(cleanWord);
        }
    });

    // Also extract potential keywords not in our predefined list
    // (words that appear multiple times or seem important)
    const wordFrequency = {};
    words.forEach(word => {
        const cleanWord = word.replace(/[^a-z0-9+#.]/g, '');
        if (cleanWord.length > 2 && !stopWords.has(cleanWord)) {
            wordFrequency[cleanWord] = (wordFrequency[cleanWord] || 0) + 1;
        }
    });

    // Add frequently occurring words as potential keywords
    Object.entries(wordFrequency)
        .filter(([_, count]) => count >= 2)
        .forEach(([word, _]) => {
            if (!stopWords.has(word) && /^[a-z][a-z0-9+#.]*$/.test(word)) {
                foundKeywords.add(word);
            }
        });

    return foundKeywords;
}

/**
 * Calculate match score and find missing/matched keywords
 */
function analyzeMatch(jobDescription, resume) {
    const jobKeywords = extractKeywords(jobDescription);
    const resumeKeywords = extractKeywords(resume);

    const matchedKeywords = new Set();
    const missingKeywords = new Set();

    jobKeywords.forEach(keyword => {
        // Check if resume contains this keyword (with some fuzzy matching)
        const resumeLower = resume.toLowerCase();
        if (resumeKeywords.has(keyword) || resumeLower.includes(keyword)) {
            matchedKeywords.add(keyword);
        } else {
            missingKeywords.add(keyword);
        }
    });

    // Calculate score
    const totalKeywords = jobKeywords.size;
    const matchedCount = matchedKeywords.size;
    const score = totalKeywords > 0 ? Math.round((matchedCount / totalKeywords) * 100) : 0;

    return {
        score,
        matchedKeywords: Array.from(matchedKeywords).sort(),
        missingKeywords: Array.from(missingKeywords).sort(),
        totalJobKeywords: totalKeywords
    };
}

/**
 * Get score message based on percentage
 */
function getScoreMessage(score) {
    if (score >= 80) {
        return { text: '🎉 Excellent match! Your resume aligns very well with this job.', class: 'excellent' };
    } else if (score >= 60) {
        return { text: '👍 Good match! Some improvements could make your resume even stronger.', class: 'good' };
    } else if (score >= 40) {
        return { text: '⚡ Average match. Consider adding more relevant keywords.', class: 'average' };
    } else {
        return { text: '⚠️ Low match. Your resume may need significant updates for this role.', class: 'poor' };
    }
}

/**
 * Generate tips based on analysis
 */
function generateTips(missingKeywords, score) {
    const tips = [];

    if (score < 60) {
        tips.push('Carefully review the job description and mirror the exact language and terminology used.');
    }

    if (missingKeywords.length > 10) {
        tips.push('Focus on adding the most frequently mentioned missing keywords first - they\'re likely the most important.');
    }

    // Check for specific categories of missing keywords
    const missingSet = new Set(missingKeywords.map(k => k.toLowerCase()));

    const missingTech = keywordCategories.programmingLanguages.filter(k => missingSet.has(k));
    if (missingTech.length > 0) {
        tips.push(`Add technical skills like ${missingTech.slice(0, 3).join(', ')} if you have experience with them.`);
    }

    const missingFrameworks = keywordCategories.frameworks.filter(k => missingSet.has(k));
    if (missingFrameworks.length > 0) {
        tips.push(`Include frameworks and libraries like ${missingFrameworks.slice(0, 3).join(', ')} if applicable.`);
    }

    const missingSoft = keywordCategories.softSkills.filter(k => missingSet.has(k));
    if (missingSoft.length > 0) {
        tips.push(`Incorporate soft skills like ${missingSoft.slice(0, 3).join(', ')} with specific examples.`);
    }

    const missingCloud = keywordCategories.cloudPlatforms.filter(k => missingSet.has(k));
    if (missingCloud.length > 0) {
        tips.push(`Mention cloud platforms like ${missingCloud.slice(0, 3).join(', ')} if you\'ve used them.`);
    }

    tips.push('Use bullet points to clearly highlight achievements with quantifiable results.');
    tips.push('Ensure your resume is in a simple, ATS-friendly format (avoid tables, images, and fancy formatting).');
    tips.push('Tailor your resume summary or objective to match the specific job requirements.');

    return tips.slice(0, 6); // Return max 6 tips
}

/**
 * Animate score display
 */
function animateScore(targetScore) {
    const scoreValue = document.getElementById('scoreValue');
    const scoreCircle = document.getElementById('scoreCircle');

    // Calculate the stroke offset for the progress ring
    const circumference = 2 * Math.PI * 45; // radius is 45
    const offset = circumference - (targetScore / 100) * circumference;

    // Add gradient definition to SVG if not exists
    const svg = scoreCircle.closest('svg');
    if (!svg.querySelector('#scoreGradient')) {
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        defs.innerHTML = `
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#6366f1"/>
                <stop offset="100%" stop-color="#a855f7"/>
            </linearGradient>
        `;
        svg.insertBefore(defs, svg.firstChild);
    }

    // Animate the number
    let currentScore = 0;
    const duration = 1500;
    const startTime = performance.now();

    function updateScore(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        currentScore = Math.round(targetScore * easeOut);

        scoreValue.textContent = currentScore;

        if (progress < 1) {
            requestAnimationFrame(updateScore);
        }
    }

    requestAnimationFrame(updateScore);

    // Animate the ring
    scoreCircle.style.strokeDasharray = circumference;
    scoreCircle.style.strokeDashoffset = offset;
}

/**
 * Display results
 */
function displayResults(results) {
    const resultsSection = document.getElementById('results');
    const scoreMessage = document.getElementById('scoreMessage');
    const missingKeywordsContainer = document.getElementById('missingKeywords');
    const matchedKeywordsContainer = document.getElementById('matchedKeywords');
    const tipsList = document.getElementById('tipsList');

    // Show results section
    resultsSection.classList.remove('hidden');

    // Scroll to results
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    // Animate score
    animateScore(results.score);

    // Set score message
    const message = getScoreMessage(results.score);
    scoreMessage.textContent = message.text;
    scoreMessage.className = `score-message ${message.class}`;

    // Store missing keywords globally for copy functionality
    currentMissingKeywords = results.missingKeywords;

    // Display missing keywords
    missingKeywordsContainer.innerHTML = '';
    results.missingKeywords.forEach((keyword, index) => {
        const tag = document.createElement('span');
        tag.className = 'keyword-tag missing';
        tag.textContent = keyword;
        tag.style.animationDelay = `${index * 30}ms`;
        missingKeywordsContainer.appendChild(tag);
    });

    if (results.missingKeywords.length === 0) {
        missingKeywordsContainer.innerHTML = '<span style="color: var(--gray-400);">No missing keywords found! Great job!</span>';
    }

    // Display matched keywords
    matchedKeywordsContainer.innerHTML = '';
    results.matchedKeywords.forEach((keyword, index) => {
        const tag = document.createElement('span');
        tag.className = 'keyword-tag matched';
        tag.textContent = keyword;
        tag.style.animationDelay = `${index * 30}ms`;
        matchedKeywordsContainer.appendChild(tag);
    });

    if (results.matchedKeywords.length === 0) {
        matchedKeywordsContainer.innerHTML = '<span style="color: var(--gray-400);">No matching keywords found yet.</span>';
    }

    // Display tips
    const tips = generateTips(results.missingKeywords, results.score);
    tipsList.innerHTML = '';
    tips.forEach((tip, index) => {
        const li = document.createElement('li');
        li.textContent = tip;
        li.style.animationDelay = `${index * 100}ms`;
        tipsList.appendChild(li);
    });
}

/**
 * Main analysis handler
 */
function handleAnalyze() {
    const jobDescription = document.getElementById('jobDescription').value.trim();
    const resume = document.getElementById('resume').value.trim();
    const analyzeBtn = document.getElementById('analyzeBtn');

    // Validation
    if (!jobDescription) {
        alert('Please paste the job description.');
        document.getElementById('jobDescription').focus();
        return;
    }

    if (!resume) {
        alert('Please paste your resume content.');
        document.getElementById('resume').focus();
        return;
    }

    // Show loading state
    analyzeBtn.classList.add('loading');
    analyzeBtn.disabled = true;

    // Simulate processing time for better UX
    setTimeout(() => {
        const results = analyzeMatch(jobDescription, resume);
        displayResults(results);

        // Remove loading state
        analyzeBtn.classList.remove('loading');
        analyzeBtn.disabled = false;
    }, 800);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const analyzeBtn = document.getElementById('analyzeBtn');
    analyzeBtn.addEventListener('click', handleAnalyze);

    // Copy missing keywords button
    const copyMissingBtn = document.getElementById('copyMissingBtn');
    copyMissingBtn.addEventListener('click', copyMissingKeywords);

    // Allow Ctrl+Enter to analyze
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            handleAnalyze();
        }
    });
});
