'use client'

import { useState } from 'react'

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "What is XFoli AI?",
          answer: "XFoli AI is an intelligent portfolio tracking application that combines real-time stock market data with AI-powered analysis. It helps you monitor your investments and provides professional-grade insights into your portfolio's performance using advanced artificial intelligence."
        },
        {
          question: "How do I get started?",
          answer: "Getting started is simple! Sign up for a free account, create your first portfolio, and add your stock holdings by entering the ticker symbols and quantities. The app will automatically fetch current market data and calculate your portfolio's value."
        },
        {
          question: "Is XFoli AI free to use?",
          answer: "Yes! XFoli AI is completely free to use. You can track unlimited portfolios, add unlimited holdings, and access all AI analysis features without any cost or subscription fees."
        },
        {
          question: "Do I need to connect my brokerage account?",
          answer: "No, you don't need to connect any brokerage accounts. XFoli AI works by manually adding your stock holdings (ticker and quantity). This approach ensures maximum privacy and security since we never access your actual brokerage accounts or financial institutions."
        }
      ]
    },
    {
      category: "Features & Functionality",
      questions: [
        {
          question: "What does the AI analysis feature do?",
          answer: "The AI analysis feature provides intelligent, narrative explanations of your portfolio's daily performance. It analyzes market trends, identifies your biggest movers, explains what drove performance changes, and provides actionable recommendations for portfolio optimization."
        },
        {
          question: "How accurate is the stock market data?",
          answer: "We use reliable financial data providers to ensure accurate, real-time stock market information. However, there may be slight delays (typically under 15 minutes) and we recommend verifying critical information with your broker before making trading decisions."
        },
        {
          question: "Can I track multiple portfolios?",
          answer: "Yes! You can create and manage multiple portfolios to organize your investments by strategy, account type, or any other criteria that makes sense for you. For example, you might have separate portfolios for retirement savings, growth stocks, and dividend investments."
        },
        {
          question: "What markets and stocks are supported?",
          answer: "XFoli AI supports major US stock exchanges including NYSE and NASDAQ. We cover thousands of stocks, ETFs, and other securities. If you can't find a specific ticker, please contact us and we'll work to add it to our supported list."
        },
        {
          question: "Can I sort and analyze my holdings?",
          answer: "Absolutely! The dashboard includes advanced sorting capabilities. You can sort your holdings by symbol, company name, quantity, current price, total value, day change percentage, or dollar change amount. This makes it easy to identify your best and worst performers."
        }
      ]
    },
    {
      category: "Privacy & Security",
      questions: [
        {
          question: "How secure is my data?",
          answer: "Security is our top priority. We use bank-level encryption and secure authentication through Supabase. Your portfolio data is encrypted both in transit and at rest. We never store brokerage credentials or connect to external financial accounts."
        },
        {
          question: "What data do you collect?",
          answer: "We only collect the information necessary to provide our service: your email address for authentication, portfolio names you create, and the stock holdings you manually add (ticker symbols and quantities). We don't collect any personal financial information or brokerage account details."
        },
        {
          question: "Do you share my data with third parties?",
          answer: "No, we do not sell, share, or distribute your personal data or portfolio information to third parties. Your investment data remains private and is only used to provide you with portfolio tracking and AI analysis services."
        },
        {
          question: "Can I delete my account and data?",
          answer: "Yes, you have full control over your data. You can delete individual portfolios, holdings, or your entire account at any time. When you delete your account, all associated data is permanently removed from our systems."
        }
      ]
    },
    {
      category: "Technical Questions",
      questions: [
        {
          question: "What devices and browsers are supported?",
          answer: "XFoli AI is a web-based application that works on any device with a modern web browser. It's optimized for desktop, tablet, and mobile devices. We recommend using the latest versions of Chrome, Firefox, Safari, or Edge for the best experience."
        },
        {
          question: "Do you have a mobile app?",
          answer: "Currently, XFoli AI is a responsive web application that works great on mobile devices. You can add it to your phone's home screen for app-like experience. We're considering a dedicated mobile app for the future based on user feedback."
        },
        {
          question: "How often is data updated?",
          answer: "Stock price data is updated in real-time during market hours, with minimal delay. Portfolio calculations are updated instantly when market data changes. The AI analysis can be run on-demand whenever you want fresh insights into your portfolio's performance."
        },
        {
          question: "What happens if there's a service outage?",
          answer: "While we strive for 99.9% uptime, occasional outages may occur. During outages, your data remains safe and secure. We provide status updates and work quickly to restore service. Your portfolio data is never lost during technical issues."
        }
      ]
    },
    {
      category: "AI Analysis",
      questions: [
        {
          question: "How does the AI analysis work?",
          answer: "Our AI system analyzes your portfolio's performance by examining daily price changes, identifying the biggest movers, and correlating this with market news and trends. It then generates human-readable explanations that help you understand what happened and why."
        },
        {
          question: "Is the AI analysis financial advice?",
          answer: "No, the AI analysis is for informational and educational purposes only. It is not financial advice, investment recommendations, or trading guidance. Always conduct your own research and consult with qualified financial advisors before making investment decisions."
        },
        {
          question: "How often can I run AI analysis?",
          answer: "You can run AI analysis as often as you'd like! Each analysis provides fresh insights based on the current market data and your portfolio's latest performance. Many users run it daily to stay informed about their investments."
        },
        {
          question: "Can the AI make trading recommendations?",
          answer: "The AI provides general insights and observations about your portfolio, but it does not make specific buy, sell, or hold recommendations. It focuses on helping you understand your portfolio's performance and market trends rather than giving direct trading advice."
        }
      ]
    },
    {
      category: "Support & Contact",
      questions: [
        {
          question: "How can I get help or support?",
          answer: "If you need help, you can contact our support team through the feedback form in the application. We aim to respond to all inquiries within 24 hours. You can also check this FAQ section for answers to common questions."
        },
        {
          question: "Can I request new features?",
          answer: "Absolutely! We love hearing from our users and are constantly improving XFoli AI based on feedback. Please send us your feature requests and suggestions through our support channels. Many current features were developed based on user suggestions."
        },
        {
          question: "Is there a user guide or documentation?",
          answer: "Yes, we provide comprehensive guides and tutorials within the application. The interface is designed to be intuitive, but if you need additional help, our step-by-step guides will walk you through all features and functionality."
        },
        {
          question: "How can I report a bug or issue?",
          answer: "If you encounter any bugs or technical issues, please report them through our support channels. Include as much detail as possible about what you were doing when the issue occurred, and we'll work quickly to resolve it."
        }
      ]
    }
  ]

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Everything you need to know about XFoli AI
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-12">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                {category.category}
              </h2>
              
              <div className="space-y-4">
                {category.questions.map((faq, questionIndex) => {
                  const globalIndex = categoryIndex * 100 + questionIndex
                  const isOpen = openItems.includes(globalIndex)
                  
                  return (
                    <div 
                      key={questionIndex}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                    >
                      <button
                        className="w-full px-6 py-4 text-left bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                        onClick={() => toggleItem(globalIndex)}
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white pr-4">
                            {faq.question}
                          </h3>
                          <svg 
                            className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>
                      
                      {isOpen && (
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <div className="flex justify-center">
            <a 
              href="/signup" 
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Get Started Now
            </a>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Getting Started Guide
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Step-by-step instructions to set up your first portfolio
            </p>
          </div>

          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 00-2 2v2a2 2 0 002 2m0 0h14m-14 0a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 01-2 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Feature Overview
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Learn about all the powerful features available in XFoli AI
            </p>
          </div>

          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Support Center
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Get help from our support team and community resources
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 