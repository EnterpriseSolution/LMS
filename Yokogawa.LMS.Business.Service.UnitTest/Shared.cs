using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Yokogawa.LMS.Business.Data;
using Yokogawa.LMS.Business.Services.Interfaces;
using Yokogawa.Security.OAuth.Identity;
using Yokogawa.Security.OAuth.Interfaces;

namespace Yokogawa.LMS.Business.Service.UnitTest
{
    public class BaseServiceTest
    {
        protected const string ConnectionString = "Server=192.168.156.125;Initial Catalog=LMS;user id=sa;password=sasa";

        private LMSDBContext _dbContext;
        private ILogger _logger;
        private IUserProfile _user;

        protected virtual LMSDBContext DbContext
        {
            get
            {
                if (_dbContext == null)
                {
                    DbContextOptionsBuilder<LMSDBContext> optionsBuilder = new DbContextOptionsBuilder<LMSDBContext>();
                    optionsBuilder.UseSqlServer(ConnectionString);
                    _dbContext = new LMSDBContext(optionsBuilder.Options);
                }

                return _dbContext;
            }
        }

        private ColorConsoleLoggerConfiguration _currentConfig;

        private ColorConsoleLoggerConfiguration GetCurrentConfig() => _currentConfig;

        protected virtual ILogger Logger(string name)
        {
            return new ColorConsoleLogger(name, GetCurrentConfig);
        }

        protected virtual IUserProfile User
        {
            get
            {
                if (_user == null)
                    _user = new UserProfile();

                return _user;
            }
        }
        
        //[TestInitialize]
        //public virtual void Initialize()
        //{

        //}

        //[TestCleanup]
        //public virtual void Cleanup()
        //{

        //}
    }

    public class ColorConsoleLoggerConfiguration
    {
        public int EventId { get; set; }

        public Dictionary<LogLevel, ConsoleColor> LogLevels { get; set; } = new Dictionary<LogLevel, ConsoleColor>()
        {
            [LogLevel.Information] = ConsoleColor.Green
        };
    }

    public class ColorConsoleLogger : ILogger
    {
        private readonly string _name;
        private readonly Func<ColorConsoleLoggerConfiguration> _getCurrentConfig;

        public ColorConsoleLogger(string name, Func<ColorConsoleLoggerConfiguration> getCurrentConfig) =>
            (_name, _getCurrentConfig) = (name, getCurrentConfig);

        public IDisposable BeginScope<TState>(TState state) => default;

        public bool IsEnabled(LogLevel logLevel) =>
            _getCurrentConfig().LogLevels.ContainsKey(logLevel);

        public void Log<TState>(
            LogLevel logLevel,
            EventId eventId,
            TState state,
            Exception exception,
            Func<TState, Exception, string> formatter)
        {
            if (!IsEnabled(logLevel))
            {
                return;
            }

            ColorConsoleLoggerConfiguration config = _getCurrentConfig();
            if (config.EventId == 0 || config.EventId == eventId.Id)
            {
                ConsoleColor originalColor = Console.ForegroundColor;

                Console.ForegroundColor = config.LogLevels[logLevel];
                Console.WriteLine($"[{eventId.Id,2}: {logLevel,-12}]");

                Console.ForegroundColor = originalColor;
                Console.WriteLine($"     {_name} - {formatter(state, exception)}");
            }
        }
    }

    public sealed class ColorConsoleLoggerProvider : ILoggerProvider
    {
        private readonly IDisposable _onChangeToken;
        private ColorConsoleLoggerConfiguration _currentConfig;
        private readonly ConcurrentDictionary<string, ColorConsoleLogger> _loggers = new ConcurrentDictionary<string, ColorConsoleLogger>();

        public ColorConsoleLoggerProvider(IOptionsMonitor<ColorConsoleLoggerConfiguration> config)
        {
            _currentConfig = config.CurrentValue;
            _onChangeToken = config.OnChange(updatedConfig => _currentConfig = updatedConfig);
        }

        public ILogger CreateLogger(string categoryName) =>
            _loggers.GetOrAdd(categoryName, name => new ColorConsoleLogger(name, GetCurrentConfig));

        private ColorConsoleLoggerConfiguration GetCurrentConfig() => _currentConfig;

        public void Dispose()
        {
            _loggers.Clear();
            _onChangeToken.Dispose();
        }
    }
}