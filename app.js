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
    'respect', 'related', 'empower', 'culture', 'growth', 'datacenter', 'degree',
    'equivalent', 'experience', 'field', 'global', 'experience.', 'more', 'more.', 'more,',
    'mission', 'others', 'planet', 'meet', 'mindset', 'vision', 'visionary', 'visionary.',
    'weeks', 'week', 'month', 'months', 'year', 'years', 'day', 'days', 'hour', 'hours', 'minute', 'minutes', 'second', 'seconds',
    'week', 'month', 'year', 'day', 'hour', 'minute', 'second', 'week.', 'month.', 'year.', 'day.', 'hour.', 'minute.', 'second.',
    'week,', 'month,', 'year,', 'day,', 'hour,', 'minute,', 'second,', 'mindset', 'innovate', 'qualifications', 'resilience', 'standards', 'values'
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

// Store uploaded file content
let uploadedResumeContent = '';

/**
 * Read file content based on file type
 */
async function readFileContent(file) {
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.txt')) {
        return await file.text();
    } else if (fileName.endsWith('.pdf')) {
        // For PDF files, we'll use a basic text extraction
        // Note: Full PDF parsing requires a library like pdf.js
        return await extractTextFromPDF(file);
    } else if (fileName.endsWith('.docx')) {
        // For DOCX files, extract text from the XML
        return await extractTextFromDOCX(file);
    }

    throw new Error('Unsupported file format');
}

/**
 * Extract text from PDF using PDF.js library
 */
async function extractTextFromPDF(file) {
    try {
        // Check if PDF.js is loaded
        if (typeof pdfjsLib === 'undefined') {
            console.error('PDF.js library not loaded');
            return `[PDF file: ${file.name}]\n\nNote: PDF parsing library not loaded. Please refresh the page or paste your resume content directly.`;
        }

        // Set the worker source
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        const arrayBuffer = await file.arrayBuffer();

        // Load the PDF document
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        let fullText = '';

        // Extract text from each page
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();

            // Extract text items and join them
            const pageText = textContent.items
                .map(item => item.str)
                .join(' ');

            fullText += pageText + '\n\n';
        }

        // Clean up the text
        fullText = fullText
            .replace(/\s+/g, ' ')
            .replace(/\n\s*\n/g, '\n\n')
            .trim();

        if (fullText.length < 20) {
            return `[PDF file: ${file.name}]\n\nNote: This PDF appears to contain mostly images or scanned content. For best results, please copy and paste the text content directly from your resume.`;
        }

        return fullText;

    } catch (error) {
        console.error('PDF extraction error:', error);
        return `[PDF file: ${file.name}]\n\nError: ${error.message}\n\nPlease try copying and pasting the text content directly from your resume.`;
    }
}

/**
 * Extract text from DOCX file
 */
async function extractTextFromDOCX(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        // DOCX is a ZIP file, we need to find the document.xml file
        // Look for the PK signature and try to find document.xml content
        const decoder = new TextDecoder('utf-8', { fatal: false });
        const content = decoder.decode(uint8Array);

        // Look for XML text content
        const textRegex = /<w:t[^>]*>([^<]+)<\/w:t>/g;
        let text = '';
        let match;

        while ((match = textRegex.exec(content)) !== null) {
            text += match[1] + ' ';
        }

        // Clean up
        text = text
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/\s+/g, ' ')
            .trim();

        if (text.length < 50) {
            return `[DOCX content detected - "${file.name}"]\n\nNote: For best results with DOCX files, please copy and paste the text content directly. Basic text extraction found: ${text || 'No extractable text found.'}`;
        }

        return text;
    } catch (error) {
        console.error('DOCX extraction error:', error);
        return `[DOCX file: ${file.name}]\n\nNote: Could not extract text from this file. Please copy and paste the text content directly for best results.`;
    }
}

/**
 * Handle file selection
 */
async function handleFileSelect(file) {
    if (!file) return;

    const validExtensions = ['.txt', '.pdf', '.docx'];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some(ext => fileName.endsWith(ext));

    if (!isValid) {
        alert('Please upload a TXT, PDF, or DOCX file.');
        return;
    }

    const uploadZone = document.getElementById('uploadZone');
    const uploadContent = uploadZone.querySelector('.upload-content');
    const uploadedFile = document.getElementById('uploadedFile');
    const fileNameSpan = document.getElementById('fileName');
    const resumeTextarea = document.getElementById('resume');

    try {
        // Show loading state
        uploadContent.innerHTML = '<p class="upload-text">Reading file...</p>';

        // Read file content
        uploadedResumeContent = await readFileContent(file);

        // Update UI to show uploaded file
        uploadContent.style.display = 'none';
        uploadedFile.classList.remove('hidden');
        fileNameSpan.textContent = file.name;
        uploadZone.classList.add('has-file');

        // Also populate the textarea with extracted content
        resumeTextarea.value = uploadedResumeContent;

    } catch (error) {
        console.error('Error reading file:', error);
        alert('Error reading file. Please try again or paste your resume manually.');
        resetUploadZone();
    }
}

/**
 * Reset upload zone to initial state
 */
function resetUploadZone() {
    const uploadZone = document.getElementById('uploadZone');
    const uploadContent = uploadZone.querySelector('.upload-content');
    const uploadedFile = document.getElementById('uploadedFile');
    const resumeFileInput = document.getElementById('resumeFile');

    if (uploadContent) {
        uploadContent.style.display = 'flex';
        uploadContent.innerHTML = `
            <div class="upload-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M12 3V15M12 3L7 8M12 3L17 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <p class="upload-text">Drag & drop your resume or <span class="upload-link">browse files</span></p>
            <p class="upload-formats">Supports: TXT, PDF, DOCX</p>
        `;
    }

    uploadedFile.classList.add('hidden');
    uploadZone.classList.remove('has-file');
    resumeFileInput.value = '';
    uploadedResumeContent = '';
}

/**
 * Setup file upload handlers
 */
function setupFileUpload() {
    const uploadZone = document.getElementById('uploadZone');
    const resumeFileInput = document.getElementById('resumeFile');
    const removeFileBtn = document.getElementById('removeFile');

    // Click to browse
    uploadZone.addEventListener('click', (e) => {
        if (e.target.closest('.remove-file')) return;
        resumeFileInput.click();
    });

    // File input change
    resumeFileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    });

    // Drag and drop
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('drag-over');
    });

    uploadZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('drag-over');
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('drag-over');

        if (e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    });

    // Remove file button
    removeFileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        resetUploadZone();
        document.getElementById('resume').value = '';
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const analyzeBtn = document.getElementById('analyzeBtn');
    analyzeBtn.addEventListener('click', handleAnalyze);

    // Copy missing keywords button
    const copyMissingBtn = document.getElementById('copyMissingBtn');
    copyMissingBtn.addEventListener('click', copyMissingKeywords);

    // Setup file upload
    setupFileUpload();

    // Allow Ctrl+Enter to analyze
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            handleAnalyze();
        }
    });
});
