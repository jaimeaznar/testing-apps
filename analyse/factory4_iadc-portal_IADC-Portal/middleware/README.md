**TODO: MOVE TO CONFLUENCE**   
# ROLES BASED ACCESS  
  
The 'rolesGuard' middleware will watch if the user is logged in or not.   
If he isn't the middleware will redirect the user to the login page.   
Once the user is logged in the middleware will check the user's permission.   
If the user does not have the permission to access to the page he will encounter a Forbidden 403 error.    
    
The roles are declared in the /api/data-menu.ts. To set a restriction you need to add the 'restrictedTo' like this:  

```restrictedTo: ['role1', 'roles2', ...]  ```

      {    
        title: 'Feedback',    
        group: 'feedback',    
        icon: 'mdi-emoticon-happy-outline',    
        href: 'feedback-dashboard',    
        disabled: false,    
        restrictedTo: ['role1', 'roles2', ...]  
      }  
  
There is also an option called 'visibleToAnonymous', If you set it to true the user will be able to see the item in the drawer   
but if he don't have to rights to access to it or your are not logged in, the item will be disabled and a lock icon will be displayed on the right side of the item.
  
      {    
        title: 'Feedback',    
        group: 'feedback',    
        icon: 'mdi-emoticon-happy-outline',    
        href: 'feedback-dashboard',    
        disabled: false,    
        restrictedTo: ['role1', 'roles2', ...]  
        visibleToAnonymous: true,  
      }  
