using System;
using System.Collections.Generic;
using System.Text;
using System.DirectoryServices.AccountManagement;
using System.DirectoryServices;

namespace Yokogawa.Data.Infrastructure.Utils
{
    public static class DirectoryServicesUtility
    {
        public static UserPrincipal ValidateUser(string username,string password, string domain) {
            bool isValid = false;
            using (PrincipalContext pc = new PrincipalContext(ContextType.Domain, domain))
            {
                isValid = pc.ValidateCredentials(username, password);
                if (isValid)
                    return UserPrincipal.FindByIdentity(pc, IdentityType.SamAccountName, username);
                else
                    return null;
            }
        }

        public static List<UserPrincipal> FindUser(string fieldType,string searchText,string domain) {
            var users = new List<UserPrincipal>();
            using (PrincipalContext pc = new PrincipalContext(ContextType.Domain, domain))
            {
                using (var searcher = new PrincipalSearcher(new UserPrincipal(pc)))
                {
                    if (fieldType == "ID" && searchText != null)
                        searcher.QueryFilter.SamAccountName = "*" + searchText + "*";
                    else if (fieldType == "NAME" && searchText != null)
                        searcher.QueryFilter.DisplayName = "*" + searchText + "*";
                    else
                        return users;

                    var result = searcher.FindAll();
                    if (result != null)
                    {
                        foreach (var user in result)
                        {
                            UserPrincipal usr = UserPrincipal.FindByIdentity(pc, IdentityType.SamAccountName, user.SamAccountName);
                            if (usr != null)
                                users.Add(usr);
                        }
                    }
                }
            }
            return users;
           
        }

        public static void ChangePassword(string domain,string userName, string currentPassword, string newPassword)
        {
            try
            {
                using (PrincipalContext pc = new PrincipalContext(ContextType.Domain, domain)) {
                    using (var user = UserPrincipal.FindByIdentity(pc, IdentityType.SamAccountName, userName))
                    {
                        user.ChangePassword(currentPassword, newPassword);
                        user.Save();
                    }
                }
                   
            }
            catch (Exception ex)
            {
                throw new Exception("change AD password:"+ex.Message);
            }
        }
    }
}
