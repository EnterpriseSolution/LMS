using System;
using System.Collections.Generic;
using System.Text;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Yokogawa.LMS.Exceptions;

namespace Yokogawa.LMS.Exceptions.CustomMiddlewares
{
    public class CustomExceptionMiddleware
    {
        private readonly ILogger<CustomExceptionMiddleware> _logger;

        private readonly RequestDelegate _next;

        public CustomExceptionMiddleware(RequestDelegate next, ILogger<CustomExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next.Invoke(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var message = exception.InnerException?.Message ?? exception.Message;
            _logger.LogError(exception, "Message: {Message} \n StackTrace: {stacktrace}", exception.Message, exception.StackTrace);
            //var response = context.Response;
            var customException = exception as BaseCustomException;
            var statusCode = (int)HttpStatusCode.InternalServerError;
           
            if (customException != null)
            {
                message = customException.Message;
                statusCode = customException.Code;
            }
            else if (exception is UnauthorizedAccessException)
            {
                message = exception.Message;
                statusCode = (int)HttpStatusCode.Unauthorized;
            }


            string response = JsonConvert.SerializeObject(new CustomErrorResponse()
            {
                Message = message
            });
            context.Response.StatusCode = statusCode;
            context.Response.ContentType = "application/json";
            context.Response.ContentLength = response.Length;
            await context.Response.WriteAsync(response);
        }
    }
}
